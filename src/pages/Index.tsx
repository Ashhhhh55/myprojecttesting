
import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import { UserProvider } from "@/contexts/UserContext";
import { PersonDataProvider } from "@/contexts/PersonDataContext";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in from local storage
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);
  
  return (
    <UserProvider>
      <PersonDataProvider>
        <div className="min-h-screen bg-gray-50">
          {isLoggedIn ? (
            <Dashboard setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          )}
        </div>
      </PersonDataProvider>
    </UserProvider>
  );
};

export default Index;
