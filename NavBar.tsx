import React from 'react';
import { Aperture } from 'lucide-react';

export const NavBar: React.FC = () => {
  return (
    <nav className="w-full bg-modera-900/90 backdrop-blur-md border-b border-modera-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-modera-accent to-yellow-600 p-2 rounded-lg shadow-lg shadow-yellow-900/20">
              <Aperture className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-white tracking-wide">MODERA <span className="text-modera-accent">AI</span></h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              <span className="text-modera-accent text-xs font-medium uppercase tracking-widest border border-modera-accent/30 px-2 py-1 rounded">
                Professional Edition
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};