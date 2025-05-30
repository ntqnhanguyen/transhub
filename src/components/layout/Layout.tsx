import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Layout({ children, currentPage, setCurrentPage }: LayoutProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme} min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      <div className="fixed top-0 left-0 h-screen z-30">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      <div className="flex-1 ml-16 md:ml-64">
        <Header currentPage={currentPage} />
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;