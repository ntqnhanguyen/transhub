import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Eye, 
  Edit3,
  Trash2
} from 'lucide-react';

export default function Teams() {
  const [activeTab, setActiveTab] = useState('members');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  
  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@company.com',
      role: 'admin',
      avatar: 'A',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400',
      status: 'active',
      joinedDate: '6 months ago'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'admin',
      avatar: 'S',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-600 dark:text-purple-400',
      status: 'active',
      joinedDate: '4 months ago'
    },
    {
      id: 3,
      name: 'Michael Kim',
      email: 'michael.kim@company.com',
      role: 'editor',
      avatar: 'M',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400',
      status: 'active',
      joinedDate: '3 months ago'
    },
    {
      id: 4,
      name: 'Jessica Lopez',
      email: 'jessica.lopez@company.com',
      role: 'editor',
      avatar: 'J',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
      textColor: 'text-amber-600 dark:text-amber-400',
      status: 'active',
      joinedDate: '1 month ago'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      role: 'viewer',
      avatar: 'D',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400',
      status: 'active',
      joinedDate: '2 weeks ago'
    },
  ];
  
  const pendingInvitations = [
    {
      id: 1,
      email: 'john.smith@company.com',
      role: 'editor',
      invitedBy: 'Alex Johnson',
      invitedDate: '2 days ago'
    },
    {
      id: 2,
      email: 'maria.garcia@company.com',
      role: 'viewer',
      invitedBy: 'Sarah Chen',
      invitedDate: '1 week ago'
    }
  ];
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
            <Shield size={12} className="mr-1" />
            Admin
          </span>
        );
      case 'editor':
        return (
          <span className="flex items-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full">
            <Edit3 size={12} className="mr-1" />
            Editor
          </span>
        );
      case 'viewer':
        return (
          <span className="flex items-center bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
            <Eye size={12} className="mr-1" />
            Viewer
          </span>
        );
      default:
        return null;
    }
  };
  
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an invitation
    alert(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your team members and their permissions.</p>
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
            <UserPlus size={18} className="mr-2" />
            Invite Member
          </button>
        </div>
      </div>
      
      {/* Team overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Total Members</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{teamMembers.length}</span>
            <span className="ml-2 text-sm text-green-600 dark:text-green-400">+2 this month</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Pending Invitations</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{pendingInvitations.length}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Active Projects</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">12</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">across teams</span>
          </div>
        </div>
      </div>
      
      {/* Tabs and content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 px-4">
            <button 
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('members')}
            >
              Team Members
            </button>
            <button 
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Invitations
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {activeTab === 'members' ? (
            <>
              <div className="mb-4 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full sm:w-64 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400\" size={18} />
                </div>
                
                <div>
                  <select className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200">
                    <option>All roles</option>
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3">Member</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${member.bgColor} ${member.textColor} flex items-center justify-center mr-3`}>
                              {member.avatar}
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getRoleBadge(member.role)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {member.joinedDate}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Invite New Team Member</h3>
                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                      />
                      <Mail className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
                    </div>
                  </div>
                  
                  <div>
                    <select 
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <UserPlus size={18} className="mr-2" />
                    Invite
                  </button>
                </form>
              </div>
              
              <h3 className="text-lg font-medium mb-3">Pending Invitations</h3>
              
              {pendingInvitations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Invited By</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {pendingInvitations.map((invitation) => (
                        <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Mail size={16} className="text-gray-400 mr-2" />
                              <p>{invitation.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getRoleBadge(invitation.role)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {invitation.invitedBy}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {invitation.invitedDate}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Mail size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No pending invitations</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}