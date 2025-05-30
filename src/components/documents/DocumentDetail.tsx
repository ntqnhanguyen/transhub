import { useState } from 'react';
import { 
  FileText, 
  Languages, 
  Clock, 
  Check, 
  X, 
  Download, 
  Save,
  Edit3,
  History,
  MessageSquare,
  User,
  ChevronRight
} from 'lucide-react';

interface DocumentDetailProps {
  document: {
    id: number;
    name: string;
    sourceLanguage: string;
    targetLanguage: string;
    status: string;
    progress: number;
    type: string;
  };
  onClose: () => void;
}

export function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  const [activeTab, setActiveTab] = useState('translation');
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  // Mock translation segments
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
    },
    // Add more segments as needed
  ];

  // Mock comments
  const comments = [
    {
      id: 1,
      user: 'Sarah Chen',
      text: 'Please review the translation of "fiscal year" - we usually use "ejercicio fiscal"',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: 'Alex Johnson',
      text: 'Updated as suggested',
      timestamp: '1 hour ago'
    }
  ];

  // Mock version history
  const versions = [
    {
      id: 1,
      user: 'AI Translation',
      timestamp: '3 hours ago',
      type: 'initial'
    },
    {
      id: 2,
      user: 'Sarah Chen',
      timestamp: '2 hours ago',
      type: 'review'
    },
    {
      id: 3,
      user: 'Alex Johnson',
      timestamp: '1 hour ago',
      type: 'edit'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 95) return 'text-green-600 dark:text-green-400';
    if (score >= 85) return 'text-blue-600 dark:text-blue-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <FileText size={20} className="mr-2" />
              {document.name}
            </h2>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{document.sourceLanguage}</span>
              <ChevronRight size={16} className="mx-1" />
              <span>{document.targetLanguage}</span>
              <span className="mx-2">•</span>
              <span>{document.progress}% Complete</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 px-4">
            <button 
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'translation' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('translation')}
            >
              Translation
            </button>
            <button 
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('comments')}
            >
              Comments
            </button>
            <button 
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Version History
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'translation' && (
            <div className="p-4">
              <div className="space-y-4">
                {segments.map((segment) => (
                  <div 
                    key={segment.id}
                    className={`border rounded-lg ${
                      selectedSegment === segment.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(segment.status)}`}>
                          {segment.status === 'completed' ? <Check size={12} className="inline mr-1" /> : <Clock size={12} className="inline mr-1" />}
                          {segment.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="text-xs flex items-center">
                          Confidence: 
                          <span className={`ml-1 font-medium ${getConfidenceColor(segment.confidence)}`}>
                            {segment.confidence}%
                          </span>
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedSegment(segment.id)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
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
                        {selectedSegment === segment.id ? (
                          <textarea
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"
                            value={segment.target}
                            rows={3}
                          />
                        ) : (
                          <p>{segment.target}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="p-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{comment.user}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{comment.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="p-4">
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        {version.type === 'initial' ? (
                          <Languages size={16} className="text-blue-600 dark:text-blue-400" />
                        ) : version.type === 'review' ? (
                          <Check size={16} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <Edit3 size={16} className="text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{version.user}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{version.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              <Download size={16} className="mr-1" />
              <span className="text-sm">Download</span>
            </button>
            <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              <History size={16} className="mr-1" />
              <span className="text-sm">Compare Versions</span>
            </button>
            <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              <MessageSquare size={16} className="mr-1" />
              <span className="text-sm">Add Comment</span>
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
            <Save size={16} className="mr-1.5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}