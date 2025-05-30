import { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Filter, 
  Search, 
  MoreHorizontal, 
  ArrowDown, 
  ArrowUp, 
  ChevronRight, 
  Check, 
  FileCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { UploadModal } from '../components/documents/UploadModal';
import { DocumentDetail } from '../components/documents/DocumentDetail';

export default function Documents() {
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('dateModified');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  
  // Mock document data
  const documents = [
    {
      id: 1,
      name: 'Q3 Financial Report.docx',
      sourceLanguage: 'English',
      targetLanguage: 'Spanish',
      status: 'completed',
      dateModified: 'Today',
      size: '2.4 MB',
      progress: 100,
      type: 'docx'
    },
    {
      id: 2,
      name: 'Product Manual v2.pdf',
      sourceLanguage: 'English',
      targetLanguage: 'French',
      status: 'inReview',
      dateModified: 'Yesterday',
      size: '5.7 MB',
      progress: 85,
      type: 'pdf'
    },
    {
      id: 3,
      name: 'Marketing Presentation.pptx',
      sourceLanguage: 'English',
      targetLanguage: 'German',
      status: 'inProgress',
      dateModified: '2 days ago',
      size: '3.1 MB',
      progress: 60,
      type: 'pptx'
    },
    {
      id: 4,
      name: 'Legal Contract Draft.docx',
      sourceLanguage: 'English',
      targetLanguage: 'Chinese',
      status: 'inProgress',
      dateModified: '3 days ago',
      size: '1.8 MB',
      progress: 30,
      type: 'docx'
    },
    {
      id: 5,
      name: 'Customer Survey Results.xlsx',
      sourceLanguage: 'English',
      targetLanguage: 'Japanese',
      status: 'queued',
      dateModified: '1 week ago',
      size: '1.2 MB',
      progress: 0,
      type: 'xlsx'
    },
    {
      id: 6,
      name: 'Technical Specifications.pdf',
      sourceLanguage: 'English',
      targetLanguage: 'Korean',
      status: 'queued',
      dateModified: '1 week ago',
      size: '4.5 MB',
      progress: 0,
      type: 'pdf'
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'inReview':
        return <FileCheck size={16} className="text-amber-500" />;
      case 'inProgress':
        return <Clock size={16} className="text-blue-500" />;
      case 'queued':
        return <AlertCircle size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'inReview':
        return 'In Review';
      case 'inProgress':
        return 'In Progress';
      case 'queued':
        return 'Queued';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inReview':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'queued':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'dateModified') {
      // This is a simplified sort for the mock data
      // In a real app, you'd use actual date objects
      return sortDirection === 'asc' ? 1 : -1;
    } else if (sortBy === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Documents</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload, translate, and manage your documents.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
        >
          <Upload size={18} className="mr-2" />
          Upload Document
        </button>
      </div>
      
      {/* Search and filter bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search documents..."
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
            
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button 
                onClick={() => setView('grid')} 
                className={`px-3 py-2 ${view === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
              <button 
                onClick={() => setView('list')} 
                className={`px-3 py-2 ${view === 'list' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Document list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {view === 'list' ? (
          // List view
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('name')}
                    >
                      Document
                      {sortBy === 'name' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">Languages</th>
                  <th className="px-4 py-3">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortBy === 'status' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('dateModified')}
                    >
                      Modified
                      {sortBy === 'dateModified' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedDocuments.map((doc) => (
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
                        <ChevronRight size={14} className="mx-1 text-gray-400" />
                        <span>{doc.targetLanguage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center w-fit space-x-1 ${getStatusColor(doc.status)}`}>
                        <span>{getStatusIcon(doc.status)}</span>
                        <span>{getStatusText(doc.status)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px] mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${doc.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{doc.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {doc.dateModified}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {doc.size}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Grid view
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedDocument(doc)}
              >
                <div className="h-32 bg-gray-100 dark:bg-gray-750 flex items-center justify-center">
                  <FileText size={40} className="text-gray-400" />
                </div>
                
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                    <button 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 -mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{doc.sourceLanguage}</span>
                    <ChevronRight size={12} className="mx-1" />
                    <span>{doc.targetLanguage}</span>
                  </div>
                  
                  <div className="mt-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full inline-flex items-center space-x-1 ${getStatusColor(doc.status)}`}>
                      <span>{getStatusIcon(doc.status)}</span>
                      <span>{getStatusText(doc.status)}</span>
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${doc.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{doc.progress}%</span>
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{doc.dateModified}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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