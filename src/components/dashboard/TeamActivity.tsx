import { Users, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TeamActivityProps {
  teamMembers: any[];
}

export function TeamActivity({ teamMembers }: TeamActivityProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Users size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="font-semibold">Team Activity</h2>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          View team
          <ArrowRight size={14} className="ml-1" />
        </button>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member) => (
          <div 
            key={member.id} 
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center mb-3">
              <div className={`w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium mr-3`}>
                {member.user_profiles.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{member.user_profiles.full_name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Activity</span>
                  <span>Active</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: '80%' }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Project</p>
                  <p className="font-medium">{member.projects.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Last Active</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(member.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}