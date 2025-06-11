import { useState, useEffect } from 'react';
import { FileText, Languages, Clock, BarChart3, ChevronDown, ChevronUp, Users, Edit3, FileCheck, Plus } from 'lucide-react';
import { TranslationStats } from '../components/dashboard/TranslationStats';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { RecentDocuments } from '../components/dashboard/RecentDocuments';
import { TeamActivity } from '../components/dashboard/TeamActivity';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { QuickTranslateModal } from '../components/translation/QuickTranslateModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [statsExpanded, setStatsExpanded] = useState(true);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isQuickTranslateModalOpen, setIsQuickTranslateModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalDocuments: 0,
    pendingDocuments: 0,
    totalLanguages: 0,
    newLanguages: 0,
    teamMembers: 0,
    pendingInvitations: 0,
    timeSaved: 0,
    projects: [],
    recentDocuments: [],
    teamActivity: []
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // First, get project IDs where user is a project member
        const { data: projectMemberProjects } = await supabase
          .from('project_members')
          .select('project_id')
          .eq('user_id', user.id);

        // Get project IDs where user is the owner
        const { data: ownedProjects } = await supabase
          .from('projects')
          .select('id')
          .eq('owner_id', user.id);

        // Combine and deduplicate project IDs
        const projectIds = [
          ...new Set([
            ...(projectMemberProjects?.map(p => p.project_id) || []),
            ...(ownedProjects?.map(p => p.id) || [])
          ])
        ];

        // Fetch projects using the combined project IDs
        const { data: projects } = await supabase
          .from('projects')
          .select(`
            *,
            project_members!inner(user_id),
            documents(count)
          `)
          .in('id', projectIds)
          .order('created_at', { ascending: false });

        // Fetch recent documents for these projects
        const { data: documents } = await supabase
          .from('documents')
          .select(`
            *,
            project:projects!inner(
              name,
              owner_id,
              project_members(user_id)
            ),
            translations(count)
          `)
          .in('project_id', projectIds)
          .order('updated_at', { ascending: false })
          .limit(5);

        // Only fetch project members if we have projects
        let projectMembers = [];
        if (projectIds.length > 0) {
          // First, fetch project members data
          const { data: projectMembersData } = await supabase
            .from('project_members')
            .select(`
              *,
              project:projects!inner(
                name,
                owner_id
              )
            `)
            .in('project_id', projectIds)
            .order('updated_at', { ascending: false })
            .limit(4);

          if (projectMembersData && projectMembersData.length > 0) {
            // Get unique user IDs from project members
            const userIds = [...new Set(projectMembersData.map(pm => pm.user_id))];
            
            // Fetch user profiles separately
            const { data: userProfiles } = await supabase
              .from('user_profiles')
              .select('user_id, full_name, avatar_url, email')
              .in('user_id', userIds);

            // Create a map of user profiles for easy lookup
            const userProfileMap = {};
            userProfiles?.forEach(profile => {
              userProfileMap[profile.user_id] = profile;
            });

            // Manually join the data
            projectMembers = projectMembersData.map(member => ({
              ...member,
              user_profiles: userProfileMap[member.user_id] || null
            }));
          }
        }

        // Calculate statistics
        const uniqueLanguages = new Set();
        const recentLanguages = new Set();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

        projects?.forEach(project => {
          uniqueLanguages.add(project.source_language);
          project.target_languages.forEach((lang: string) => uniqueLanguages.add(lang));

          if (new Date(project.created_at) > thirtyDaysAgo) {
            project.target_languages.forEach((lang: string) => recentLanguages.add(lang));
          }
        });

        setDashboardData({
          totalDocuments: documents?.length || 0,
          pendingDocuments: documents?.filter(d => d.status === 'queued').length || 0,
          totalLanguages: uniqueLanguages.size,
          newLanguages: recentLanguages.size,
          teamMembers: projectMembers.length,
          pendingInvitations: 2,
          timeSaved: 43,
          projects: projects || [],
          recentDocuments: documents || [],
          teamActivity: projectMembers
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Page title and welcome message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your translation projects.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            New Project
          </button>
          <button 
            onClick={() => setIsQuickTranslateModalOpen(true)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
          >
            <Languages size={18} className="mr-2" />
            Quick Translate
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Translation Overview</h2>
          <button 
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {statsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {statsExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                <FileText size={20} className="mr-2" />
                <h3 className="font-medium">Documents</h3>
              </div>
              <p className="text-2xl font-bold">{dashboardData.totalDocuments}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dashboardData.pendingDocuments} awaiting translation</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-teal-600 dark:text-teal-400 mb-2">
                <Languages size={20} className="mr-2" />
                <h3 className="font-medium">Languages</h3>
              </div>
              <p className="text-2xl font-bold">{dashboardData.totalLanguages}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dashboardData.newLanguages} added this month</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
                <Users size={20} className="mr-2" />
                <h3 className="font-medium">Team Members</h3>
              </div>
              <p className="text-2xl font-bold">{dashboardData.teamMembers}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dashboardData.pendingInvitations} pending invitations</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-amber-600 dark:text-amber-400 mb-2">
                <Clock size={20} className="mr-2" />
                <h3 className="font-medium">Time Saved</h3>
              </div>
              <p className="text-2xl font-bold">{dashboardData.timeSaved}h</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">+12h from last month</p>
            </div>
          </div>
        )}
      </div>

      {/* Translation stats chart */}
      <TranslationStats />
      
      {/* Two column layout for Recent Docs and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDocuments documents={dashboardData.recentDocuments} />
        </div>
        <div>
          <ActivityFeed projects={dashboardData.projects} />
        </div>
      </div>
      
      {/* Team activity */}
      <TeamActivity teamMembers={dashboardData.teamActivity} />

      {/* Modals */}
      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />
      
      <QuickTranslateModal
        isOpen={isQuickTranslateModalOpen}
        onClose={() => setIsQuickTranslateModalOpen(false)}
      />
    </div>
  );
}