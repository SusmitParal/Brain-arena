import React from 'react';

const ErrorFallback: React.FC<{ error: Error, resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-lobby text-white p-4">
      <div className="bg-[#1e293b]/80 p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-400 font-display">Something went wrong</h1>
        <p className="text-xl mb-8 text-gray-300">An unexpected error has occurred. Please try refreshing the page.</p>
        <pre className="text-left bg-black/20 p-4 rounded-lg text-red-400 text-xs mb-8 overflow-auto">{error.message}</pre>
        <button onClick={resetErrorBoundary} className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg uppercase tracking-widest">
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
