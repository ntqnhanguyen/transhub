import { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: "Annual Report 2024",
      description: "Translation of company annual report and financial statements",
      sourceLanguage: "English",
      targetLanguages: ["Spanish", "French", "German"],
      progress: 75,
      status: "inProgress",
      teamSize: 5,
      documentsCount: 8,
      dueDate: "2024-03-15",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "Product Documentation",
      description: "Technical documentation for new product launch",
      sourceLanguage: "English",
      targetLanguages: ["Chinese", "Japanese", "Korean"],
      progress: 30,
      status: "inProgress",
      teamSize: 4,
      documentsCount: 12,
      dueDate: "2024-04-01",
      lastUpdated: "1 day ago"
    },
    {
      id: 3,
      name: "Marketing Campaign Q1",
      description: "Marketing materials for Q1 global campaign",
      sourceLanguage: "English",
      targetLanguages: ["Spanish", "Portuguese", "Italian"],
      progress: 90,
      status: "review",
      teamSize: 3,
      documentsCount: 5,
      dueDate: "2024-02-28",
      lastUpdated: "3 days ago"
    }
  ];

  // Mock documents data for the selected project
  const documents = [
    {
      id: 1,
      name: "Q4_Financial_Report.docx",
      sourceLanguage: "English",
      targetLanguage: "Spanish",
      status: "completed",
      progress: 100,
      translator: "Sarah Chen",
      lastModified: "2 hours ago",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Executive_Summary.pdf",
      sourceLanguage: "English",
      targetLanguage: "French",
      status: "inProgress",
      progress: 65,
      translator: "Michael Kim",
      lastModified: "1 day ago",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Appendix_Data.xlsx",
      sourceLanguage: "English",
      targetLanguage: "German",
      status: "queued",
      progress: 0,
      translator: "Unassigned",
      lastModified: "3 days ago",
      size: "956 KB"
    }
  ];

  // Mock team members data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Lead Translator",
      avatar: "S",
      documentsAssigned: 3,
      lastActive: "1 hour ago"
    },
    {
      id: 2,
      name: "Michael Kim",
      role: "Translator",
      avatar: "M",
      documentsAssigned: 2,
      lastActive: "3 hours ago"
    },
    {
      id: 3,
      name: "Jessica Lopez",
      role: "Reviewer",
      avatar: "J",
      documentsAssigned: 4,
      lastActive: "2 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'inProgress':
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
      case 'inProgress':
        return 'In Progress';
      default:
        return status;
    }
  };

  // Mock translation segments for document detail
  const segments = [
    {
      id: 1,
      source: "Welcome to our company's annual report for the fiscal year 2023.",
      target: "Bienvenidos a nuestro informe anual de la empresa para el año fiscal 2023.",
      status: 'completed',
      confidence: 98
    },
    {
      id: 2,
      source: "This year has been marked by significant growth and innovation.",
      target: "Este año ha estado marcado por un crecimiento e innovación significativos.",
      status: 'completed',
      confidence: 95
    },
    {
      id: 3,
      source: "Our revenue increased by 25% compared to the previous year.",
      target: "Nuestros ingresos aumentaron un 25% en comparación con el año anterior.",
      status: 'inProgress',
      confidence: 92
    }
  ];

  if (selectedProject) {
    return (
      <div className="space-y-6">
        {/* Project header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => {
                setSelectedProject(null);
                setSelectedDocument(null);
              }}
              className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back to Projects
            </button>
            <div>
              <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{selectedProject.description}</p>
            </div>
          </div>
        </div>

        {/* Project info cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400">Progress</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProject.status)}`}>
                {getStatusText(selectedProject.status)}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{selectedProject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400">Languages</h3>
            <div className="mt-2 flex items-center">
              <span className="font-medium">{selectedProject.sourceLanguage}</span>
              <ArrowRight size={16} className="mx-2 text-gray-400" />
              <span>{selectedProject.targetLanguages.length} languages</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400">Team</h3>
            <div className="mt-2">
              <span className="font-medium">{selectedProject.teamSize} members</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400">Due Date</h3>
            <div className="mt-2">
              <span className="font-medium">
                {new Date(selectedProject.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 px-4">
              <button 
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents' 
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
              <button 
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'team' 
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('team')}
              >
                Team
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {selectedDocument ? (
                  // Document detail view
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => setSelectedDocument(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ← Back to Documents
                      </button>
                      <div className="flex space-x-2">
                        <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
                          <Download size={16} className="mr-1.5" />
                          Download
                        </button>
                        <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                          <Save size={16} className="mr-1.5" />
                          Save Changes
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold flex items-center">
                          <FileText size={20} className="mr-2" />
                          {selectedDocument.name}
                        </h2>
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{selectedDocument.sourceLanguage}</span>
                          <ArrowRight size={14} className="mx-1" />
                          <span>{selectedDocument.targetLanguage}</span>
                          <span className="mx-2">•</span>
                          <span>{selectedDocument.progress}% Complete</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-4">
                          {segments.map((segment) => (
                            <div 
                              key={segment.id}
                              className="border rounded-lg border-gray-200 dark:border-gray-700"
                            >
                              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(segment.status)}`}>
                                    {segment.status === 'completed' ? <Check size={12} className="inline mr-1" /> : <Clock size={12} className="inline mr-1" />}
                                    {segment.status === 'completed' ? 'Completed' : 'In Progress'}
                                  </span>
                                  <span className="text-xs">
                                    Confidence: {segment.confidence}%
                                  </span>
                                </div>
                                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                  Edit
                                </button>
                              </div>
                              <div className="p-3 grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                                    Source
                                  </p>
                                  <p>{segment.source}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                                    Translation
                                  </p>
                                  <p>{segment.target}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Documents list view
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-md">
                        <input
                          type="text"
                          placeholder="Search documents..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
                          <Filter size={16} className="mr-1.5" />
                          <span className="text-sm">Filter</span>
                        </button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                          <Upload size={16} className="mr-1.5" />
                          Upload Document
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <th className="px-4 py-3">Document</th>
                            <th className="px-4 py-3">Languages</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Progress</th>
                            <th className="px-4 py-3">Translator</th>
                            <th className="px-4 py-3">Modified</th>
                            <th className="px-4 py-3">Size</th>
                            <th className="px-4 py-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {documents.map((doc) => (
                            <tr 
                              key={doc.id} 
                              className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 cursor-pointer"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <FileText size={16} className="text-gray-400 mr-2" />
                                  <span className="text-sm font-medium">{doc.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center text-sm">
                                  <span>{doc.sourceLanguage}</span>
                                  <ArrowRight size={14} className="mx-1 text-gray-400" />
                                  <span>{doc.targetLanguage}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                                  {getStatusText(doc.status)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 max-w-[100px] mr-2">
                                    <div 
                                      className="bg-blue-600 h-1.5 rounded-full" 
                                      style={{ width: `${doc.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs">{doc.progress}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {doc.translator}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {doc.lastModified}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {doc.size}
                              </td>
                              <td className="px-4 py-3">
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
                )}
              </div>
            )}

            {activeTab === 'team' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium mr-3">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Documents Assigned</span>
                        <span>{member.documentsAssigned}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Last Active</span>
                        <span>{member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
              <option>All Projects</option>
              <option>Active</option>
              <option>Completed</option>
              <option>In Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold truncate">{project.name}</h3>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <MoreHorizontal size={16} />
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
                  <span className="text-gray-500 dark:text-gray-400">{project.lastUpdated}</span>
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
                  <span>{project.sourceLanguage}</span>
                  <ArrowRight size={14} className="mx-1 text-gray-400" />
                  <span>{project.targetLanguages.length} languages</span>
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

                <div className="flex items-center text-sm">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
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
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}