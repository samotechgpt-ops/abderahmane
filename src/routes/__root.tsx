import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gold glow-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-gradient-gold px-6 py-2 text-sm font-semibold text-primary-foreground shadow-gold">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Réessayez ou revenez à l'accueil.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground"
          >Réessayer</button>
          <a href="/" className="rounded-md border border-border px-4 py-2 text-sm font-medium">Accueil</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Noren Grooming — Prise de RDV Premium en Algérie" },
      { name: "description", content: "Réservez votre rendez-vous chez Noren Grooming. Service barbier premium dans les 69 wilayas et zones d'Algérie. Confirmation immédiate via WhatsApp." },
      { name: "author", content: "Noren Grooming" },
      { property: "og:title", content: "Noren Grooming — Prise de RDV Premium en Algérie" },
      { property: "og:description", content: "Réservez votre rendez-vous chez Noren Grooming. Service barbier premium dans les 69 wilayas et zones d'Algérie. Confirmation immédiate via WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Noren Grooming — Prise de RDV Premium en Algérie" },
      { name: "twitter:description", content: "Réservez votre rendez-vous chez Noren Grooming. Service barbier premium dans les 69 wilayas et zones d'Algérie. Confirmation immédiate via WhatsApp." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2bb9426a-6153-4dcf-8db1-477483bb6ab2/id-preview-e17b06a4--8440b3c1-d529-4315-b723-4794d90e7eab.lovable.app-1782299324171.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2bb9426a-6153-4dcf-8db1-477483bb6ab2/id-preview-e17b06a4--8440b3c1-d529-4315-b723-4794d90e7eab.lovable.app-1782299324171.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
