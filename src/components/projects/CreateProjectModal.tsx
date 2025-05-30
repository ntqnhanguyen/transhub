import { useState } from 'react';
import { X, Plus, Search, Users, Languages, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    sourceLanguage: 'en',
    targetLanguages: [] as string[],
    team: [] as string[]
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreate = async () => {
    if (!user) return;
    
    setIsLoading(true);
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
          status: 'draft'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Add team members
      if (projectData.team.length > 0) {
        const teamMembers = projectData.team.map(userId => ({
          project_id: project.id,
          user_id: userId,
          role: 'translator'
        }));

        const { error: teamError } = await supabase
          .from('team_members')
          .insert(teamMembers);

        if (teamError) throw teamError;
      }

      onClose();
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
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

  const handleTeamMemberToggle = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      team: prev.team.includes(id)
        ? prev.team.filter(memberId => memberId !== id)
        : [...prev.team, id]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Progress indicator */}
          <div className="flex items-center mb-6">
            <div className={`w-1/2 h-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-1/2 h-1 rounded-full mx-1 ${step === 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Project Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name
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
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Language Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source Language
                </label>
                <select
                  value={projectData.sourceLanguage}
                  onChange={(e) => setProjectData({ ...projectData, sourceLanguage: e.target.value })}
                  className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Languages
                </label>
                <div className="grid grid-cols-2 gap-2">
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
                      <Languages size={16} className="mr-2 text-gray-400" />
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 2 ? (
            <button
              onClick={handleNext}
              disabled={!projectData.name}
              className={`
                px-4 py-2 rounded-lg transition-colors duration-200
                ${!projectData.name
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'}
              `}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isLoading || projectData.targetLanguages.length === 0}
              className={`
                px-4 py-2 rounded-lg transition-colors duration-200 flex items-center
                ${isLoading || projectData.targetLanguages.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'}
              `}
            >
              <Plus size={18} className="mr-2" />
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}