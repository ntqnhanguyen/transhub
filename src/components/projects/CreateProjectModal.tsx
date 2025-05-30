import { useState } from 'react';
import { X, Plus, Languages, Globe, UserPlus, Trash2, Mail, Shield, Edit3, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  email: string;
  role: 'owner' | 'admin' | 'translator' | 'reviewer';
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    sourceLanguage: 'en',
    targetLanguages: [] as string[],
    dueDate: ''
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<TeamMember['role']>('translator');
  
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

  const handleAddMember = () => {
    if (!newMemberEmail || teamMembers.some(member => member.email === newMemberEmail)) {
      return;
    }
    
    setTeamMembers([...teamMembers, { email: newMemberEmail, role: newMemberRole }]);
    setNewMemberEmail('');
    setNewMemberRole('translator');
  };

  const handleRemoveMember = (email: string) => {
    setTeamMembers(teamMembers.filter(member => member.email !== email));
  };

  const getRoleBadge = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return (
          <span className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
            <Shield size={12} className="mr-1" />
            Owner
          </span>
        );
      case 'admin':
        return (
          <span className="flex items-center bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs px-2 py-1 rounded-full">
            <Shield size={12} className="mr-1" />
            Admin
          </span>
        );
      case 'translator':
        return (
          <span className="flex items-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full">
            <Edit3 size={12} className="mr-1" />
            Translator
          </span>
        );
      case 'reviewer':
        return (
          <span className="flex items-center bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
            <Eye size={12} className="mr-1" />
            Reviewer
          </span>
        );
    }
  };

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

      // Create team member entries
      const teamMemberPromises = [
        // Add owner
        supabase.from('team_members').insert({
          project_id: project.id,
          user_id: user.id,
          role: 'owner'
        }),
        // Add invited members
        ...teamMembers.map(member => 
          supabase.from('team_members').insert({
            project_id: project.id,
            email: member.email,
            role: member.role,
            status: 'pending'
          })
        )
      ];

      const results = await Promise.all(teamMemberPromises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error('Failed to add some team members');
      }

      onClose();
      // Reset form
      setProjectData({
        name: '',
        description: '',
        sourceLanguage: 'en',
        targetLanguages: [],
        dueDate: ''
      });
      setTeamMembers([]);
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

            {/* Team Members */}
            <div>
              <h3 className="text-lg font-medium mb-4">Team Members</h3>
              
              {/* Current user (owner) */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Project Owner</p>
                    </div>
                  </div>
                  {getRoleBadge('owner')}
                </div>
              </div>

              {/* Invite members */}
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
                      />
                      <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                  </div>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as TeamMember['role'])}
                    className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="translator">Translator</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                  <button
                    onClick={handleAddMember}
                    disabled={!newMemberEmail}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus size={18} className="mr-2" />
                    Add
                  </button>
                </div>

                {/* Invited members list */}
                {teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center font-medium">
                            {member.email[0].toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{member.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending invitation</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getRoleBadge(member.role)}
                          <button
                            onClick={() => handleRemoveMember(member.email)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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