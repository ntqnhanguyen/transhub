import { useState } from 'react';
import { Globe, Check, X, Plus, Search, Trash2, Edit2, Save } from 'lucide-react';

export default function LanguageSettings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLanguage, setEditingLanguage] = useState<number | null>(null);

  // Mock language settings
  const languages = [
    {
      id: 1,
      name: "English",
      code: "en",
      direction: "ltr",
      status: "active",
      supportedFeatures: ["OCR", "Speech", "Dictionary"],
      qualityScore: 98,
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "Spanish",
      code: "es",
      direction: "ltr",
      status: "active",
      supportedFeatures: ["OCR", "Speech", "Dictionary"],
      qualityScore: 95,
      lastUpdated: "1 day ago"
    },
    {
      id: 3,
      name: "French",
      code: "fr",
      direction: "ltr",
      status: "active",
      supportedFeatures: ["OCR", "Dictionary"],
      qualityScore: 94,
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      name: "Arabic",
      code: "ar",
      direction: "rtl",
      status: "active",
      supportedFeatures: ["OCR"],
      qualityScore: 90,
      lastUpdated: "1 week ago"
    }
  ];

  const features = [
    { id: "OCR", name: "Optical Character Recognition" },
    { id: "Speech", name: "Text-to-Speech" },
    { id: "Dictionary", name: "Dictionary Support" }
  ];

  const handleDelete = (id: number) => {
    // Implement delete functionality
  };

  const handleEdit = (id: number) => {
    setEditingLanguage(id);
  };

  const handleSave = (id: number) => {
    setEditingLanguage(null);
    // Implement save functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Language Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure supported languages and their features.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
          <Plus size={18} className="mr-2" />
          Add Language
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
        </div>
      </div>

      {/* Language settings table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Direction</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Features</th>
                <th className="px-4 py-3">Quality Score</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3 w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {languages.map((language) => (
                <tr key={language.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Globe size={16} className="text-gray-400 mr-2" />
                      {editingLanguage === language.id ? (
                        <input
                          type="text"
                          className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-1"
                          defaultValue={language.name}
                        />
                      ) : (
                        <span className="font-medium">{language.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingLanguage === language.id ? (
                      <input
                        type="text"
                        className="w-20 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-1"
                        defaultValue={language.code}
                      />
                    ) : (
                      <span className="text-sm">{language.code}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingLanguage === language.id ? (
                      <select
                        className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-1"
                        defaultValue={language.direction}
                      >
                        <option value="ltr">Left to Right</option>
                        <option value="rtl">Right to Left</option>
                      </select>
                    ) : (
                      <span className="text-sm">
                        {language.direction === 'ltr' ? 'Left to Right' : 'Right to Left'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingLanguage === language.id ? (
                      <select
                        className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-1"
                        defaultValue={language.status}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        language.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {language.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingLanguage === language.id ? (
                      <div className="space-y-1">
                        {features.map(feature => (
                          <label key={feature.id} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              className="mr-2"
                              defaultChecked={language.supportedFeatures.includes(feature.id)}
                            />
                            {feature.name}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {language.supportedFeatures.map(feature => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${
                      language.qualityScore >= 95 ? 'text-green-600 dark:text-green-400' :
                      language.qualityScore >= 85 ? 'text-blue-600 dark:text-blue-400' :
                      'text-amber-600 dark:text-amber-400'
                    }`}>
                      {language.qualityScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {language.lastUpdated}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {editingLanguage === language.id ? (
                        <>
                          <button
                            onClick={() => handleSave(language.id)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingLanguage(null)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(language.id)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(language.id)}
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