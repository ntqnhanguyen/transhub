import { useState } from 'react';
import { Search, Download, Upload, Plus, Trash2, Edit2, Check, X, Filter, ArrowDownWideNarrow } from 'lucide-react';

export default function TranslationMemory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);

  // Mock translation memory entries
  const entries = [
    {
      id: 1,
      sourceText: "Welcome to our platform",
      targetText: "Bienvenido a nuestra plataforma",
      sourceLang: "English",
      targetLang: "Spanish",
      lastUsed: "2 hours ago",
      frequency: 45,
      quality: 98
    },
    {
      id: 2,
      sourceText: "Please confirm your email address",
      targetText: "Por favor confirma tu dirección de correo electrónico",
      sourceLang: "English",
      targetLang: "Spanish",
      lastUsed: "1 day ago",
      frequency: 32,
      quality: 95
    },
    {
      id: 3,
      sourceText: "Terms and Conditions",
      targetText: "Términos y Condiciones",
      sourceLang: "English",
      targetLang: "Spanish",
      lastUsed: "3 days ago",
      frequency: 28,
      quality: 100
    }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' }
  ];

  const handleImport = () => {
    // Implement import functionality
  };

  const handleExport = () => {
    // Implement export functionality
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
  };

  const handleEdit = (id: number) => {
    setEditingEntry(id);
  };

  const handleSave = (id: number) => {
    setEditingEntry(null);
    // Implement save functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Translation Memory</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and reuse your previous translations to maintain consistency.
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
            <Upload size={18} className="mr-2" />
            Import
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
            <Plus size={18} className="mr-2" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search translations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
          </div>
          
          <div className="flex space-x-2">
            <select 
              className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
              multiple={false}
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            
            <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
              <Filter size={16} className="mr-1.5" />
              <span className="text-sm">Filter</span>
            </button>
            
            <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
              <ArrowDownWideNarrow size={16} className="mr-1.5" />
              <span className="text-sm">Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Translation memory table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3">Source Text</th>
                <th className="px-4 py-3">Target Text</th>
                <th className="px-4 py-3">Languages</th>
                <th className="px-4 py-3">Last Used</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Quality</th>
                <th className="px-4 py-3 w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3">
                    {editingEntry === entry.id ? (
                      <textarea
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-2"
                        defaultValue={entry.sourceText}
                      />
                    ) : (
                      <span>{entry.sourceText}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingEntry === entry.id ? (
                      <textarea
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-2"
                        defaultValue={entry.targetText}
                      />
                    ) : (
                      <span>{entry.targetText}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <span>{entry.sourceLang}</span>
                      <span className="mx-2">→</span>
                      <span>{entry.targetLang}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {entry.lastUsed}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {entry.frequency} uses
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${
                      entry.quality >= 95 ? 'text-green-600 dark:text-green-400' :
                      entry.quality >= 85 ? 'text-blue-600 dark:text-blue-400' :
                      'text-amber-600 dark:text-amber-400'
                    }`}>
                      {entry.quality}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {editingEntry === entry.id ? (
                        <>
                          <button
                            onClick={() => handleSave(entry.id)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingEntry(null)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(entry.id)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}