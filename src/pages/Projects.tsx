import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Users, 
  FileText,
  Calendar,
  Languages,
  ArrowRight,
  ChevronDown,
  Upload,
  Download,
  Save,
  Edit3,
  History,
  MessageSquare,
  User,
  Clock,
  Check,
  X,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        // First, get project IDs where user is a team member
        const { data: teamMemberProjects } = await supabase
          .from('team_members')
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
            ...(teamMemberProjects?.map(p => p.project_id) || []),
            ...(ownedProjects?.map(p => p.id) || [])
          ])
        ];

        // If no projects found, set empty array and return
        if (projectIds.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }

        // Fetch full project details using the combined project IDs
        const { data, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            team_members(
              user_id,
              role
            ),
            documents(count)
          `)
          .in('id', projectIds)
          .order('updated_at', { ascending: false });

        if (projectsError) throw projectsError;

        const projectsWithTeamSize = data.map(project => ({
          ...project,
          teamSize: project.team_members ? new Set(project.team_members.map((m: any) => m.user_id)).size : 0,
          documentsCount: project.documents?.[0]?.count || 0
        }));

        setProjects(projectsWithTeamSize);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'review':
        return 'In Review';
      case 'active':
        return 'Active';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start max-w-md">
          <AlertCircle className="text-red-500 mt-0.5 mr-3" size={16} />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    return (
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your translation projects and documents.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          New Project
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
          </div>
          
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
              <Filter size={16} className="mr-1.5" />
              <span className="text-sm">Filter</span>
            </button>
            
            <select className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500">
              <option value="">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="review">In Review</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold truncate">{project.name}</h3>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Languages size={16} className="text-gray-400 mr-2" />
                  <span>{project.source_language}</span>
                  <ArrowRight size={14} className="mx-1 text-gray-400" />
                  <span>{project.target_languages.length} languages</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users size={16} className="text-gray-400 mr-2" />
                    <span>{project.teamSize} members</span>
                  </div>
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    <span>{project.documentsCount} docs</span>
                  </div>
                </div>

                {project.due_date && (
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span>Due {format(new Date(project.due_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <button 
                onClick={() => setSelectedProject(project)}
                className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center"
              >
                View Project
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          // Refresh projects list after creating a new project
          if (user) {
            const fetchProjects = async () => {
              // First, get project IDs where user is a team member
              const { data: teamMemberProjects } = await supabase
                .from('team_members')
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
                  ...(teamMemberProjects?.map(p => p.project_id) || []),
                  ...(ownedProjects?.map(p => p.id) || [])
                ])
              ];

              if (projectIds.length === 0) {
                setProjects([]);
                return;
              }

              const { data, error } = await supabase
                .from('projects')
                .select(`
                  *,
                  team_members(
                    user_id,
                    role
                  ),
                  documents(count)
                `)
                .in('id', projectIds)
                .order('updated_at', { ascending: false });

              if (error) {
                console.error('Error fetching projects:', error);
                return;
              }

              const projectsWithTeamSize = data.map(project => ({
                ...project,
                teamSize: project.team_members ? new Set(project.team_members.map((m: any) => m.user_id)).size : 0,
                documentsCount: project.documents?.[0]?.count || 0
              }));

              setProjects(projectsWithTeamSize);
            };

            fetchProjects();
          }
        }}
      />
    </div>
  );
}