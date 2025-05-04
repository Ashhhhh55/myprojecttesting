
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from "@/contexts/UserContext";
import { PersonDataProvider } from "@/contexts/PersonDataContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <PersonDataProvider>
        <App />
      </PersonDataProvider>
    </UserProvider>
  </React.StrictMode>
);
