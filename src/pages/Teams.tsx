import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Eye, 
  Edit3,
  Trash2,
  Plus,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Teams() {
  const [activeTab, setActiveTab] = useState('members');
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const { user } = useAuth();
  
  // Form states
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: ''
  });
  
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'editor',
    teamId: ''
  });

  useEffect(() => {
    if (!user) return;
    fetchTeams();
  }, [user]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            id,
            user_id,
            role,
            user_profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: newTeamData.name,
          description: newTeamData.description,
          owner_id: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team owner
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      setIsCreateTeamModalOpen(false);
      setNewTeamData({ name: '', description: '' });
      fetchTeams();
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      // Create invitation
      const { error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          team_id: inviteData.teamId,
          email: inviteData.email,
          role: inviteData.role,
          invited_by: user.id
        });

      if (inviteError) throw inviteError;

      setIsInviteModalOpen(false);
      setInviteData({ email: '', role: 'editor', teamId: '' });
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const CreateTeamModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Create New Team</h2>
          <button 
            onClick={() => setIsCreateTeamModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateTeam} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={newTeamData.name}
                onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newTeamData.description}
                onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your team's purpose"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateTeamModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !newTeamData.name}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} className="mr-2" />
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const InviteMemberModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Invite Team Member</h2>
          <button 
            onClick={() => setIsInviteModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleInviteMember} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team *
              </label>
              <select
                required
                value={inviteData.teamId}
                onChange={(e) => setInviteData({ ...inviteData, teamId: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role *
              </label>
              <select
                value={inviteData.role}
                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !inviteData.email || !inviteData.teamId}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus size={18} className="mr-2" />
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your teams and their members.</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
          >
            <UserPlus size={18} className="mr-2" />
            Invite Member
          </button>
          <button
            onClick={() => setIsCreateTeamModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create Team
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-red-500 mt-0.5 mr-3" size={16} />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <div 
            key={team.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">{team.name}</h3>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              
              {team.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {team.description}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Members</h4>
                  <div className="flex -space-x-2">
                    {team.team_members.map((member: any) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium ring-2 ring-white dark:ring-gray-800"
                        title={member.user_profiles?.full_name}
                      >
                        {member.user_profiles?.full_name?.[0] || '?'}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setInviteData({ ...inviteData, teamId: team.id });
                        setIsInviteModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ring-2 ring-white dark:ring-gray-800"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total Members</span>
                    <span className="font-medium">{team.team_members.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <button className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                View Team Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {isCreateTeamModalOpen && <CreateTeamModal />}
      {isInviteModalOpen && <InviteMemberModal />}
    </div>
  );
}