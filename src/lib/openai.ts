import OpenAI from 'openai';
import { supabase } from './supabase';

let openaiInstance: OpenAI | null = null;

export async function getOpenAIInstance() {
  if (!openaiInstance) {
    const { data: settings } = await supabase
      .from('settings')
      .select('openai_api_key, openai_model, openai_base_url')
      .single();

    if (!settings?.openai_api_key) {
      throw new Error('OpenAI API key not configured');
    }

    openaiInstance = new OpenAI({
      apiKey: settings.openai_api_key,
      baseURL: settings.openai_base_url || undefined,
      dangerouslyAllowBrowser: true
    });
  }
  return openaiInstance;
}

export async function translateText(text: string, sourceLang: string, targetLang: string) {
  const openai = await getOpenAIInstance();
  
  const { data: settings } = await supabase
    .from('settings')
    .select('openai_model')
    .single();

  const model = settings?.openai_model || 'gpt-3.5-turbo';

  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Maintain the original formatting and tone. Only return the translated text without any additional comments or explanations:\n\n${text}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a professional translator.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content?.trim() || '';
}