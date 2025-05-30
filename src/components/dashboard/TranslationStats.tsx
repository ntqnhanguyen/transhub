import { BarChart3 } from 'lucide-react';

export function TranslationStats() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BarChart3 size={20} className="text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-semibold">Translation Activity</h2>
        </div>
        <select className="bg-gray-100 dark:bg-gray-700 border-0 rounded-md py-1 px-3 text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      
      <div className="w-full h-64 flex items-end justify-between space-x-2 px-4">
        {/* This is a mockup of a bar chart - in a real app, use a charting library */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
          const heights = [40, 65, 35, 80, 60, 30, 50];
          const normalizedHeight = `${heights[index]}%`;
          
          return (
            <div key={day} className="flex flex-col items-center flex-1">
              <div 
                style={{ height: normalizedHeight }} 
                className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity duration-200"
              ></div>
              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{day}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Documents Translated</p>
          <p className="text-xl font-semibold">32</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Words Translated</p>
          <p className="text-xl font-semibold">24,568</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Quality Score</p>
          <p className="text-xl font-semibold">93%</p>
        </div>
      </div>
    </div>
  );
}