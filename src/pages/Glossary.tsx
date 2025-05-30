import { useState } from 'react';
import { Search, Download, Upload, Plus, Trash2, Edit2, Check, X, Filter, ArrowDownWideNarrow, Book } from 'lucide-react';

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTerm, setEditingTerm] = useState<number | null>(null);

  // Mock glossary terms
  const terms = [
    {
      id: 1,
      term: "Privacy Policy",
      translation: "Política de Privacidad",
      definition: "A document that explains how an organization handles customer data",
      domain: "Legal",
      notes: "Always capitalize both words",
      lastModified: "2 hours ago"
    },
    {
      id: 2,
      term: "Machine Learning",
      translation: "Aprendizaje Automático",
      definition: "A subset of artificial intelligence focused on data and algorithms",
      domain: "Technology",
      notes: "Alternate translation: Aprendizaje de Máquina",
      lastModified: "1 day ago"
    },
    {
      id: 3,
      term: "User Interface",
      translation: "Interfaz de Usuario",
      definition: "The visual elements users interact with in software",
      domain: "Technology",
      notes: "Abbreviation: UI",
      lastModified: "3 days ago"
    }
  ];

  const domains = [
    "Legal",
    "Technology",
    "Marketing",
    "Finance",
    "Healthcare",
    "General"
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
    setEditingTerm(id);
  };

  const handleSave = (id: number) => {
    setEditingTerm(null);
    // Implement save functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Glossary</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage terminology and maintain consistent translations across your projects.
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
            Add Term
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
          </div>
          
          <div className="flex space-x-2">
            <select 
              className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
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

      {/* Glossary table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">Translation</th>
                <th className="px-4 py-3">Definition</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Last Modified</th>
                <th className="px-4 py-3 w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {terms.map((term) => (
                <tr key={term.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3">
                    {editingTerm === term.id ? (
                      <input
                        type="text"
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-2"
                        defaultValue={term.term}
                      />
                    ) : (
                      <span className="font-medium">{term.term}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTerm === term.id ? (
                      <input
                        type="text"
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-2"
                        defaultValue={term.translation}
                      />
                    ) : (
                      <span>{term.translation}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTerm === term.id ? (
                      <textarea
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-2"
                        defaultValue={term.definition}
                      />
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-300">{term.definition}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTerm === term.id ? (
                      <select
                        className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-2"
                        defaultValue={term.domain}
                      >
                        {domains.map(domain => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm">{term.domain}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTerm === term.id ? (
                      <textarea
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg p-2"
                        defaultValue={term.notes}
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{term.notes}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {term.lastModified}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {editingTerm === term.id ? (
                        <>
                          <button
                            onClick={() => handleSave(term.id)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingTerm(null)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(term.id)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(term.id)}
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