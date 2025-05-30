import { useState } from 'react';
import { X, Plus, Search, Users, Languages, FileText } from 'lucide-react';

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

  const teamMembers = [
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Translator' },
    { id: 2, name: 'Michael Kim', email: 'michael.kim@company.com', role: 'Reviewer' },
    { id: 3, name: 'Jessica Lopez', email: 'jessica.lopez@company.com', role: 'Editor' },
    { id: 4, name: 'David Wilson', email: 'david.wilson@company.com', role: 'Translator' }
  ];

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreate = () => {
    // Here you would implement the project creation logic
    console.log('Creating project:', projectData);
    onClose();
  };

  const handleLanguageToggle = (code: string) => {
    setProjectData(prev => ({
      ...prev,
      targetLanguages: prev.targetLanguages.includes(code)
        ? prev.targetLanguages.filter(lang => lang !== code)
        : [...prev.targetLanguages, code]
    }));
  };

  const handleTeamMemberToggle = (id: number) => {
    setProjectData(prev => ({
      ...prev,
      team: prev.team.includes(id.toString())
        ? prev.team.filter(memberId => memberId !== id.toString())
        : [...prev.team, id.toString()]
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
            <div className={`w-1/3 h-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-1/3 h-1 rounded-full mx-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-1/3 h-1 rounded-full ${step === 3 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
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

          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Team Members</h3>
              
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
              </div>

              <div className="space-y-2">
                {teamMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => handleTeamMemberToggle(member.id)}
                    className={`
                      w-full p-3 rounded-lg border flex items-center justify-between
                      ${projectData.team.includes(member.id.toString())
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
                    `}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        {member.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    {projectData.team.includes(member.id.toString()) && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
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
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Create Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}