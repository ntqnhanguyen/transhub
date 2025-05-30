import { FileText, MoreHorizontal, Check, ExternalLink, Download, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentDocumentsProps {
  documents: any[];
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <FileText size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="font-semibold">Recent Documents</h2>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          View all
          <ArrowRight size={14} className="ml-1" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium truncate max-w-[200px]">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <span>{doc.source_language}</span>
                    <ArrowRight size={14} className="mx-2 text-gray-400" />
                    <span>{doc.target_language}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${doc.progress}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
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
    </div>
  );
}