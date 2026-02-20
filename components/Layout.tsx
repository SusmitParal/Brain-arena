import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full text-white flex flex-col relative overflow-hidden">
       {/* Main Content Container - We rely on body background in index.html for the gradient */}
       <div className="flex-1 w-full max-w-lg mx-auto flex flex-col relative z-10 pb-4">
          {children}
       </div>
    </div>
  );
};

export default Layout;