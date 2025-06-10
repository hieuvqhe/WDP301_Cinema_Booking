import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const MainLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showHeader && <Header />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;