
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  currentUser: string | null;
  setCurrentUser: (user: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(
    localStorage.getItem('currentUser') || null
  );

  const handleSetCurrentUser = (user: string | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', user);
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
