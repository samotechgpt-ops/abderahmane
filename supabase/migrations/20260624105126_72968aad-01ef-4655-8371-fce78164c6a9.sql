
CREATE POLICY "anon upload id-cards" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'id-cards');
