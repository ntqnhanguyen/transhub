import { useState } from 'react';
import { 
  X, 
  Users, 
  FileText, 
  Calendar, 
  Languages, 
  Upload, 
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  Check,
  ArrowRight,
  Download,
  Trash2,
  Edit2
} from 'lucide-react';
import { UploadModal } from '../documents/UploadModal';
import { DocumentDetail } from '../documents/DocumentDetail';

interface ProjectDetailProps {
  project: {
    id: number;
    name: string;
    description: string;
    sourceLanguage: string;
    targetLanguages: string[];
    progress: number;
    status: string;
    teamSize: number;
    documentsCount: number;
    dueDate: string;
    lastUpdated: string;
  };
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: "Q4_Financial_Report.docx",
      sourceLanguage: project.sourceLanguage,
      targetLanguage: project.targetLanguages[0],
      status: "completed",
      progress: 100,
      translator: "Sarah Chen",
      lastModified: "2 hours ago",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Executive_Summary.pdf",
      sourceLanguage: project.sourceLanguage,
      targetLanguage: project.targetLanguages[1],
      status: "inProgress",
      progress: 65,
      translator: "Michael Kim",
      lastModified: "1 day ago",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Appendix_Data.xlsx",
      sourceLanguage: project.sourceLanguage,
      targetLanguage: project.targetLanguages[2],
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
      case 'inProgress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={14} />;
      case 'inProgress':
      case 'review':
        return <Clock size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
            
            <div className="flex items-center mt-3 space-x-4 text-sm">
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Languages size={16} className="text-gray-400 mr-2" />
                <span>{project.sourceLanguage}</span>
                <ArrowRight size={14} className="mx-1 text-gray-400" />
                <span>{project.targetLanguages.length} languages</span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="text-gray-400 mr-2" />
                <span>{project.teamSize} members</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Document actions */}
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
                  <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <Upload size={16} className="mr-1.5" />
                    Upload Document
                  </button>
                </div>
              </div>

              {/* Documents table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
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
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center w-fit space-x-1 ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)}
                              <span>{doc.status}</span>
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
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle more options
                              }}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Document Detail Modal */}
      {selectedDocument && (
        <DocumentDetail
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}