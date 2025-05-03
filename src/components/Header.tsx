import { useState } from "react";
import NetlifyDeployButton from "./NetlifyDeployButton";

const Header = ({ 
  onLogout, 
  onReset, 
  isGuest 
}: { 
  onLogout: () => void, 
  onReset: () => void,
  isGuest: boolean 
}) => {
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight arabic-text rtl">
            لوحة متابعة الطلاب
          </h1>
          {isGuest && (
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md">
              Guest Mode
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {!isGuest && (
            <button
              className="text-red-500 text-sm hover:underline"
              onClick={onReset}
            >
              Reset Data
            </button>
          )}
          
          <NetlifyDeployButton />
          
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm transition-colors"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
