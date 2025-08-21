import React from 'react';
import { AppLogoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center flex-col text-center">
      <AppLogoIcon className="h-12 w-12 text-blue-600 mb-4" />
      
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
        <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
          Answer Sheet
        </span>
      </h1>
      
      <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
        Instantly extract student information and answers from multiple-choice sheets using advanced AI technology.
      </p>
    </header>
  );
};

export default Header;