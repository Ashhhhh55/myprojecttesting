
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
  currentUser: string | null;
  setCurrentUser: (user: string | null) => void;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAdmin(true); // If there's a stored user, they must be an admin
    } else if (isGuest) {
      setCurrentUser('Guest');
      setIsAdmin(false);
    }
  }, []);

  const handleSetCurrentUser = (user: string | null) => {
    setCurrentUser(user);
    setIsAdmin(user !== null && user !== 'Guest');

    if (user && user !== 'Guest') {
      localStorage.setItem('currentUser', user);
      localStorage.removeItem('isGuest');
    } else if (user === 'Guest') {
      localStorage.setItem('isGuest', 'true');
      localStorage.removeItem('currentUser');
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isGuest');
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser: handleSetCurrentUser,
      isAdmin
    }}>
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
