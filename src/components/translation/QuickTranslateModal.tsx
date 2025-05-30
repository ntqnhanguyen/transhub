import { useState } from 'react';
import { X, Languages, Copy, Check, RotateCcw, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface QuickTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickTranslateModal({ isOpen, onClose }: QuickTranslateModalProps) {
  const [sourceText, setSourceText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useAuth();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim() || !user) return;
    
    setIsTranslating(true);
    try {
      // Create a new project for the quick translation
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: 'Quick Translation',
          source_language: sourceLanguage,
          target_languages: [targetLanguage],
          owner_id: user.id,
          status: 'draft'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create a document for the translation
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert({
          project_id: project.id,
          name: 'Quick Translation Text',
          source_language: sourceLanguage,
          target_language: targetLanguage,
          status: 'in_progress',
          translator_id: user.id,
          file_url: 'quick-translation.txt',
          file_size: sourceText.length
        })
        .select()
        .single();

      if (documentError) throw documentError;

      // Create the translation
      const { data: translation, error: translationError } = await supabase
        .from('translations')
        .insert({
          document_id: document.id,
          source_text: sourceText,
          target_text: `[Translated] ${sourceText}`, // In a real app, this would use an actual translation service
          status: 'completed',
          translator_id: user.id,
          confidence_score: 95
        })
        .select()
        .single();

      if (translationError) throw translationError;

      setTranslatedText(translation.target_text);
    } catch (error) {
      console.error('Error performing quick translation:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Quick Translation</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <select 
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <div className="mx-4">→</div>

            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <textarea
                className="w-full h-64 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              ></textarea>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {sourceText.length} characters
                </span>
                <button 
                  onClick={handleClear}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            <div>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 overflow-y-auto">
                {translatedText ? (
                  <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    {isTranslating ? 'Translating...' : 'Translation will appear here'}
                  </p>
                )}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {translatedText.length} characters
                </span>
                {translatedText && (
                  <button
                    onClick={handleCopy}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className={`
              px-4 py-2 rounded-lg transition-colors duration-200 flex items-center
              ${!sourceText.trim() || isTranslating
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
            `}
          >
            <Languages size={18} className="mr-2" />
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>
    </div>
  );
}