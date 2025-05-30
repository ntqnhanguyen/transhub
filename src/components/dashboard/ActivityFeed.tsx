import { Bell, FileText, User, Edit3, Clock, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  projects: any[];
}

export function ActivityFeed({ projects }: ActivityFeedProps) {
  const activities = projects.map(project => ({
    id: project.id,
    type: 'project',
    action: project.status === 'draft' ? 'created' : 'updated',
    user: 'You',
    item: project.name,
    time: formatDistanceToNow(new Date(project.updated_at), { addSuffix: true }),
    icon: <FileText size={16} className="text-blue-500 dark:text-blue-400" />
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Bell size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="font-semibold">Recent Activity</h2>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</button>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
            <div className="flex">
              <div className="mr-3 mt-0.5">{activity.icon}</div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <Clock size={12} className="mr-1" /> {activity.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}