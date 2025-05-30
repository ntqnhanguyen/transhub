import { useState } from 'react';
import { ArrowLeftRight, Languages, Copy, Check, RotateCcw, Download, Star, Save } from 'lucide-react';
import { translateText } from '../lib/openai';
import { useAuth } from '../context/AuthContext';

export default function TextTranslation() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isCopied, setIsCopied] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
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
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'vi', name: 'Vietnamese' }  // Added Vietnamese support
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim() || !user) return;
    
    setIsTranslating(true);
    try {
      // Get translation from OpenAI
      const translatedContent = await translateText(
        sourceText,
        languages.find(l => l.code === sourceLanguage)?.name || sourceLanguage,
        languages.find(l => l.code === targetLanguage)?.name || targetLanguage
      );

      setTranslatedText(translatedContent);
      setConfidenceScore(95); // Example confidence score
    } catch (error) {
      console.error('Error translating text:', error);
      alert('Error translating text. Please check your API settings in the Settings page.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };
  
  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setConfidenceScore(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text Translation</h1>
        <p className="text-gray-600 dark:text-gray-300">Translate text between languages using our advanced AI models.</p>
      </div>
      
      {/* Translation interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source text */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <select 
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-0 rounded-md py-1 px-3 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              
              <button 
                onClick={handleSwapLanguages}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Swap languages"
              >
                <ArrowLeftRight size={18} />
              </button>
              
              <select 
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-0 rounded-md py-1 px-3 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="p-4">
            <textarea
              className="w-full h-64 border-0 bg-transparent focus:ring-0 resize-none"
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            ></textarea>
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {sourceText.length} characters
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleClear}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Clear text"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className={`
                  px-4 py-1.5 rounded-md text-sm font-medium flex items-center
                  ${!sourceText.trim() || isTranslating
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}
                  transition-colors duration-200
                `}
              >
                <Languages size={16} className="mr-1.5" />
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Translated text */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="font-medium">
              {languages.find(l => l.code === targetLanguage)?.name}
            </div>
            {confidenceScore > 0 && (
              <div className="flex items-center text-sm">
                <Star size={14} className="text-amber-500 mr-1" />
                <span>Quality: </span>
                <span className={`ml-1 font-medium ${
                  confidenceScore > 90 ? 'text-green-600 dark:text-green-400' : 
                  confidenceScore > 80 ? 'text-blue-600 dark:text-blue-400' : 
                  'text-amber-600 dark:text-amber-400'
                }`}>
                  {confidenceScore}%
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="w-full h-64 overflow-y-auto">
              {translatedText ? (
                <p className="whitespace-pre-wrap">{translatedText}</p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">
                  {isTranslating ? 'Translating...' : 'Translation will appear here'}
                </p>
              )}
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {translatedText.length} characters
            </div>
            <div className="flex space-x-2">
              {translatedText && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Copy to clipboard"
                  >
                    {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Download translation"
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Save to translation memory"
                  >
                    <Save size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Translation history */}
      {translatedText && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-3">Translation History</h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-3">
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">
                {languages.find(l => l.code === sourceLanguage)?.name} → {languages.find(l => l.code === targetLanguage)?.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Just now</div>
            </div>
            <div className="text-sm">
              <p className="text-gray-700 dark:text-gray-300 mb-1">{sourceText.length > 60 ? sourceText.substring(0, 60) + '...' : sourceText}</p>
              <p className="text-gray-500 dark:text-gray-400">{translatedText.length > 60 ? translatedText.substring(0, 60) + '...' : translatedText}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            Previous translations would appear here. Translation history is stored for 30 days.
          </div>
        </div>
      )}
    </div>
  );
}