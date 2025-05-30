-- Add openai_base_url column to settings table
ALTER TABLE settings
ADD COLUMN openai_base_url TEXT;