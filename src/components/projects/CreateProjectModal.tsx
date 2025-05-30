import { useState } from 'react';
import { X, Plus, Languages, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    sourceLanguage: 'en',
    targetLanguages: [] as string[],
    dueDate: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleCreate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          source_language: projectData.sourceLanguage,
          target_languages: projectData.targetLanguages,
          owner_id: user.id,
          status: 'draft',
          due_date: projectData.dueDate || null,
          progress: 0
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create team member entry for the owner
      const { error: teamError } = await supabase
        .from('team_members')
        .insert({
          project_id: project.id,
          user_id: user.id,
          role: 'owner'
        });

      if (teamError) throw teamError;

      onClose();
      // Reset form
      setProjectData({
        name: '',
        description: '',
        sourceLanguage: 'en',
        targetLanguages: [],
        dueDate: ''
      });
    } catch (error: any) {
      console.error('Error creating project:', error);
      setError(error.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageToggle = (code: string) => {
    setProjectData(prev => ({
      ...prev,
      targetLanguages: prev.targetLanguages.includes(code)
        ? prev.targetLanguages.filter(lang => lang !== code)
        : [...prev.targetLanguages, code]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Globe size={20} className="text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold">Create New Project</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Project Details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={projectData.name}
                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe your project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={projectData.dueDate}
                    onChange={(e) => setProjectData({ ...projectData, dueDate: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Language Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source Language *
                  </label>
                  <div className="relative inline-block w-full">
                    <select
                      value={projectData.sourceLanguage}
                      onChange={(e) => setProjectData({ ...projectData, sourceLanguage: e.target.value })}
                      className="appearance-none w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-8 focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <div className="absolute left-2 top-2.5 w-6 h-4 pointer-events-none">
                      <img 
                        src={`https://flagcdn.com/w20/${languages.find(l => l.code === projectData.sourceLanguage)?.flag}.png`}
                        srcSet={`https://flagcdn.com/w40/${languages.find(l => l.code === projectData.sourceLanguage)?.flag}.png 2x`}
                        width="20"
                        height="15"
                        alt={`${languages.find(l => l.code === projectData.sourceLanguage)?.name} flag`}
                        className="rounded-sm"
                      />
                    </div>
                    <div className="absolute right-2 top-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Languages *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {languages.filter(lang => lang.code !== projectData.sourceLanguage).map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageToggle(lang.code)}
                        className={`
                          p-2 rounded-lg border text-left flex items-center
                          ${projectData.targetLanguages.includes(lang.code)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
                        `}
                      >
                        <img 
                          src={`https://flagcdn.com/w20/${lang.flag}.png`}
                          srcSet={`https://flagcdn.com/w40/${lang.flag}.png 2x`}
                          width="20"
                          height="15"
                          alt={`${lang.name} flag`}
                          className="rounded-sm mr-2"
                        />
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading || !projectData.name || projectData.targetLanguages.length === 0}
            className={`
              px-4 py-2 rounded-lg transition-colors duration-200 flex items-center
              ${isLoading || !projectData.name || projectData.targetLanguages.length === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
            `}
          >
            <Plus size={18} className="mr-2" />
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}