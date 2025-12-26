import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background bg-pizza-pattern">
      <Header />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
