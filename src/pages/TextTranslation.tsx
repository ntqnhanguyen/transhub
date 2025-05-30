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
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'es', name: 'Spanish', flag: 'es' },
    { code: 'fr', name: 'French', flag: 'fr' },
    { code: 'de', name: 'German', flag: 'de' },
    { code: 'it', name: 'Italian', flag: 'it' },
    { code: 'pt', name: 'Portuguese', flag: 'pt' },
    { code: 'ru', name: 'Russian', flag: 'ru' },
    { code: 'zh', name: 'Chinese', flag: 'cn' },
    { code: 'ja', name: 'Japanese', flag: 'jp' },
    { code: 'ko', name: 'Korean', flag: 'kr' },
    { code: 'ar', name: 'Arabic', flag: 'sa' },
    { code: 'vi', name: 'Vietnamese', flag: 'vn' }
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

  const LanguageSelect = ({ value, onChange, languages }: { 
    value: string; 
    onChange: (value: string) => void;
    languages: typeof languages;
  }) => (
    <div className="relative inline-block">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-8 focus:ring-2 focus:ring-blue-500 min-w-[160px]"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="flex items-center">
            {lang.name}
          </option>
        ))}
      </select>
      <div className="absolute left-2 top-2.5 w-6 h-4 pointer-events-none">
        <img 
          src={`https://flagcdn.com/w20/${languages.find(l => l.code === value)?.flag}.png`}
          srcSet={`https://flagcdn.com/w40/${languages.find(l => l.code === value)?.flag}.png 2x`}
          width="20"
          height="15"
          alt={`${languages.find(l => l.code === value)?.name} flag`}
          className="rounded-sm"
        />
      </div>
      <div className="absolute right-2 top-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

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
              <LanguageSelect 
                value={sourceLanguage}
                onChange={setSourceLanguage}
                languages={languages}
              />
              
              <button 
                onClick={handleSwapLanguages}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Swap languages"
              >
                <ArrowLeftRight size={18} />
              </button>
              
              <LanguageSelect 
                value={targetLanguage}
                onChange={setTargetLanguage}
                languages={languages}
              />
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
            <div className="font-medium flex items-center">
              <img 
                src={`https://flagcdn.com/w20/${languages.find(l => l.code === targetLanguage)?.flag}.png`}
                srcSet={`https://flagcdn.com/w40/${languages.find(l => l.code === targetLanguage)?.flag}.png 2x`}
                width="20"
                height="15"
                alt={`${languages.find(l => l.code === targetLanguage)?.name} flag`}
                className="rounded-sm mr-2"
              />
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
              <div className="text-sm font-medium flex items-center">
                <img 
                  src={`https://flagcdn.com/w20/${languages.find(l => l.code === sourceLanguage)?.flag}.png`}
                  width="20"
                  height="15"
                  alt={`${languages.find(l => l.code === sourceLanguage)?.name} flag`}
                  className="rounded-sm mr-2"
                />
                {languages.find(l => l.code === sourceLanguage)?.name}
                <ArrowLeftRight size={14} className="mx-2" />
                <img 
                  src={`https://flagcdn.com/w20/${languages.find(l => l.code === targetLanguage)?.flag}.png`}
                  width="20"
                  height="15"
                  alt={`${languages.find(l => l.code === targetLanguage)?.name} flag`}
                  className="rounded-sm mr-2"
                />
                {languages.find(l => l.code === targetLanguage)?.name}
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