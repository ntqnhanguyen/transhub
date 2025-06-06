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
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  full_name: string;
  avatar_url: string | null;
  email: string;
}

interface TeamMember {
  id: string;
  role: string;
  user_profiles: UserProfile;
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  team_members: TeamMember[];
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Form states
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: ''
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'translator'
  });

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError('');

      // First get teams where user is a member
      const { data: memberTeams, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      // Get teams where user is the owner
      const { data: ownedTeams, error: ownerError } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user?.id);

      if (ownerError) throw ownerError;

      // Combine and deduplicate team IDs
      const teamIds = [
        ...new Set([
          ...(memberTeams?.map(t => t.team_id) || []),
          ...(ownedTeams?.map(t => t.id) || [])
        ])
      ];

      // If no teams found, set empty array and return
      if (teamIds.length === 0) {
        setTeams([]);
        return;
      }

      // Fetch full team details using the combined team IDs
      
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            id,
            role,
            user_profiles(
              full_name,
              avatar_url,
              email
            )
          )
        `)
        .in('id', teamIds)
        .order('created_at', { ascending: false });
      

      if (teamsError) throw teamsError;

      if (!teamsData) {
        throw new Error('No teams data received');
      }

      setTeams(teamsData);
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
      setError(''); 
      
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
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTeam) return;

    try {
      setError('');
      
      // First get the user profile for the invited email
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', inviteData.email)
        .single();

      if (profileError) throw new Error('User not found');

      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: selectedTeam.id,
          user_id: userProfile.user_id,
          role: inviteData.role
        });

      if (memberError) throw memberError;

      setIsInviteModalOpen(false);
      setInviteData({ email: '', role: 'translator' });
      fetchTeams();
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Failed to add member');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;
      fetchTeams();
    } catch (err) {
      console.error('Error deleting team:', err);
      setError('Failed to delete team');
    }
  };

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
          <h1 className="text-2xl font-bold mb-2">Teams</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your translation teams and members.</p>
        </div>
        <button 
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Team
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-red-500 mt-0.5 mr-3" size={16} />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div 
            key={team.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">{team.name}</h3>
                <button 
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {team.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Members</h4>
                  <div className="space-y-2">
                    {team.team_members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium">
                            {member.user_profiles?.full_name[0] || member.user_profiles?.email[0].toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">
                              {member.user_profiles?.full_name || member.user_profiles?.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <button 
                onClick={() => {
                  setSelectedTeam(team);
                  setIsInviteModalOpen(true);
                }}
                className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center"
              >
                <UserPlus size={16} className="mr-2" />
                Add Member
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {isCreateTeamModalOpen && (
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
                  <label className="block text-sm font-medium mb-1">Team Name</label>
                  <input
                    type="text"
                    value={newTeamData.name}
                    onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newTeamData.description}
                    onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Add Team Member</h2>
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
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="translator">Translator</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}