import { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const pageNames: Record<string, string> = {
  'dashboard': 'Dashboard',
  'text-translation': 'Text Translation',
  'documents': 'Documents',
  'teams': 'Teams',
  'settings': 'Settings',
  'translation-memory': 'Translation Memory',
  'glossary': 'Glossary',
  'language-settings': 'Language Settings'
};

export default function Header({ currentPage }: { currentPage: string }) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Refs for click outside handling
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{pageNames[currentPage] || 'Dashboard'}</h1>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-3">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <p className="text-sm font-medium">Document Translation Complete</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Annual Report.docx has been translated to Spanish.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">10 minutes ago</p>
                  </div>
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <p className="text-sm font-medium">Sarah shared a document with you</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Marketing Presentation.pptx was shared with you.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <p className="text-sm font-medium">New Team Member</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">John Doe joined Marketing Team.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {user?.email?.[0].toUpperCase()}
              </div>
              <ChevronDown size={16} className="hidden md:block text-gray-500 dark:text-gray-400" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium truncate">{user?.email}</p>
                </div>
                <div>
                  <button className="flex items-center w-full p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <Settings size={16} className="mr-2" />
                    <span>Account Settings</span>
                  </button>
                  <button className="flex items-center w-full p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <HelpCircle size={16} className="mr-2" />
                    <span>Help & Support</span>
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center w-full p-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}