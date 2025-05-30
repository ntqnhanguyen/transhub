import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Languages, 
  FolderOpen, 
  Users, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight, 
  Globe,
  Book,
  History
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { id: 'text-translation', label: 'Text Translation', icon: <Languages size={20} />, path: '/text-translation' },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={20} />, path: '/projects' },
    { id: 'teams', label: 'Teams', icon: <Users size={20} />, path: '/teams' },
  ];
  
  const toolsNavItems = [
    { id: 'translation-memory', label: 'Translation Memory', icon: <History size={20} />, path: '/translation-memory' },
    { id: 'glossary', label: 'Glossary', icon: <Book size={20} />, path: '/glossary' },
    { id: 'language-settings', label: 'Language Settings', icon: <Globe size={20} />, path: '/language-settings' },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} />, path: '/settings' },
  ];

  const handleNavigation = (item: { id: string, path: string }) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${collapsed ? 'hidden' : ''}`} 
        onClick={() => setCollapsed(true)}
      />
      
      <aside 
        className={`
          fixed md:relative z-30 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'} 
          ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="text-blue-600 dark:text-blue-400 mr-2">
              <Globe size={24} />
            </div>
            {!collapsed && <h1 className="text-lg font-bold">HCT TransHub</h1>}
          </div>
          <button 
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 md:flex hidden"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <div className="py-4">
          <div className="mb-6">
            <div className={`px-4 mb-2 text-xs uppercase text-gray-500 dark:text-gray-400 ${collapsed ? 'text-center' : ''}`}>
              {!collapsed && 'Main'}
            </div>
            <nav>
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full flex items-center px-4 py-2 text-sm
                    ${currentPage === item.id 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                    ${collapsed ? 'justify-center' : ''}
                    transition-colors duration-150
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
          
          <div>
            <div className={`px-4 mb-2 text-xs uppercase text-gray-500 dark:text-gray-400 ${collapsed ? 'text-center' : ''}`}>
              {!collapsed && 'Tools'}
            </div>
            <nav>
              {toolsNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full flex items-center px-4 py-2 text-sm
                    ${currentPage === item.id 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                    ${collapsed ? 'justify-center' : ''}
                    transition-colors duration-150
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>
      
      {/* Mobile toggle button */}
      <button 
        className="fixed bottom-4 right-4 z-40 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </>
  );
}