
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from "@/contexts/UserContext";
import { StudentDataProvider } from "@/contexts/StudentDataContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <StudentDataProvider>
        <App />
      </StudentDataProvider>
    </UserProvider>
  </React.StrictMode>
);
