
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';

export interface Person {
  id: number;
  name: string;
  level: number;
  history: number[];
  notes: string;
  zeroCount: number;
}

interface PersonDataContextType {
  persons: Person[];
  updatePersonLevel: (personId: number, newLevel: number) => void;
  updatePersonNotes: (personId: number, notes: string) => void;
  resetAllData: () => void;
  activityLog: string[];
}

const PersonDataContext = createContext<PersonDataContextType | undefined>(undefined);

const initialPersons: Person[] = [
  { id: 1, name: 'يوسف', level: 5, history: [5], notes: '', zeroCount: 0 },
  { id: 2, name: 'نور', level: 4, history: [4], notes: '', zeroCount: 0 },
  { id: 3, name: 'علي', level: 3, history: [3], notes: '', zeroCount: 0 },
  { id: 4, name: 'محمود', level: 2, history: [2], notes: '', zeroCount: 0 },
  { id: 5, name: 'كريم', level: 1, history: [1], notes: '', zeroCount: 0 },
];

export const PersonDataProvider = ({ children }: { children: ReactNode }) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const { currentUser, isAdmin } = useUser();
  
  // Load data on component mount - from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load persons from Supabase
        const { data: personsData, error: personsError } = await supabase
          .from('students')
          .select('*')
          .order('id');
        
        if (personsError) {
          console.error("Supabase persons error:", personsError);
          throw personsError;
        }
        
        // Load activity logs from Supabase
        const { data: logsData, error: logsError } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (logsError) {
          console.error("Supabase logs error:", logsError);
          throw logsError;
        }
        
        // Format persons data to match our interface
        const formattedPersons = personsData.map(person => ({
          id: person.id,
          name: person.name,
          level: person.level,
          history: person.history,
          notes: person.notes,
          zeroCount: person.zero_count
        }));
        
        // Format logs data to match our interface
        const formattedLogs = logsData.map(log => log.message);
        
        setPersons(formattedPersons);
        setActivityLog(formattedLogs);
        
        console.log("Loaded data from Supabase successfully");
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        
        // Fallback to localStorage if Supabase fails
        const savedPersons = localStorage.getItem('students');
        const savedActivityLog = localStorage.getItem('activityLog');
        
        if (savedPersons) {
          setPersons(JSON.parse(savedPersons));
        } else {
          setPersons(initialPersons);
          localStorage.setItem('students', JSON.stringify(initialPersons));
        }
        
        if (savedActivityLog) {
          setActivityLog(JSON.parse(savedActivityLog));
        }
        
        toast({
          title: "Connection Error",
          description: "Could not connect to the database. Using local data instead.",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, []);

  const updatePersonLevel = async (personId: number, newLevel: number) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Guest users cannot modify data. Please login as admin.",
        variant: "destructive"
      });
      return;
    }

    if (newLevel < 0) newLevel = 0;
    if (newLevel > 10) newLevel = 10;

    try {
      // Find the person to update
      const person = persons.find(s => s.id === personId);
      if (!person) return;

      const wasZero = person.level === 0;
      const isZero = newLevel === 0;
      
      // Update zero count if needed
      let zeroCount = person.zeroCount;
      if (isZero && !wasZero) {
        zeroCount += 1;
      }
      
      console.log(`Updating person ${personId} to level ${newLevel}`);
      
      // Update the person in the database
      const { data: updateData, error: updateError } = await supabase
        .from('students')
        .update({
          level: newLevel,
          history: [...person.history, newLevel],
          zero_count: zeroCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', personId);
      
      if (updateError) {
        console.error("Supabase person update error:", updateError);
        throw updateError;
      }
      
      console.log("Person update successful:", updateData);
      
      // Log the activity in the database
      const activityMessage = `${new Date().toLocaleString()}: ${currentUser} changed ${person.name}'s level to ${newLevel}`;
      
      console.log(`Adding activity log: ${activityMessage}`);
      
      const { data: logData, error: logError } = await supabase
        .from('activity_logs')
        .insert({
          message: activityMessage,
        });
      
      if (logError) {
        console.error("Supabase activity log error:", logError);
        throw logError;
      }
      
      console.log("Activity log added successfully:", logData);
      
      // Update the local state
      setPersons(prevPersons => {
        const updatedPersons = prevPersons.map(s => {
          if (s.id === personId) {
            return {
              ...s,
              level: newLevel,
              history: [...s.history, newLevel],
              zeroCount: zeroCount
            };
          }
          return s;
        });
        
        localStorage.setItem('students', JSON.stringify(updatedPersons));
        return updatedPersons;
      });
      
      setActivityLog(prev => {
        const updated = [activityMessage, ...prev];
        localStorage.setItem('activityLog', JSON.stringify(updated));
        return updated;
      });
      
      toast({
        title: "Level Updated",
        description: `${person.name}'s level is now ${newLevel}`,
      });
    } catch (error) {
      console.error("Error updating person level:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the person level. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updatePersonNotes = async (personId: number, notes: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Guest users cannot modify notes. Please login as admin.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`Updating notes for person ${personId}`);
      
      // Update the person notes in the database
      const { data, error } = await supabase
        .from('students')
        .update({
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', personId);
      
      if (error) {
        console.error("Supabase notes update error:", error);
        throw error;
      }
      
      console.log("Notes update successful:", data);
      
      // Update the local state
      setPersons(prevPersons => {
        const updatedPersons = prevPersons.map(person => {
          if (person.id === personId) {
            return { ...person, notes };
          }
          return person;
        });
        
        localStorage.setItem('students', JSON.stringify(updatedPersons));
        return updatedPersons;
      });
      
      toast({
        title: "Notes Updated",
        description: "Person notes have been saved.",
      });
    } catch (error) {
      console.error("Error updating person notes:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the person notes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetAllData = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Guest users cannot reset data. Please login as admin.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Resetting all data");
      
      // Reset persons table in the database
      const { error: truncateError } = await supabase
        .from('students')
        .delete()
        .not('id', 'is', null);
      
      if (truncateError) {
        console.error("Error deleting persons:", truncateError);
        throw truncateError;
      }
      
      // Insert initial data
      const { error: insertError } = await supabase
        .from('students')
        .insert(
          initialPersons.map(person => ({
            id: person.id,
            name: person.name,
            level: person.level,
            history: person.history,
            notes: person.notes,
            zero_count: person.zeroCount
          }))
        );
      
      if (insertError) {
        console.error("Error inserting person data:", insertError);
        throw insertError;
      }
      
      // Reset activity logs
      const { error: logResetError } = await supabase
        .from('activity_logs')
        .delete()
        .not('id', 'is', null);
      
      if (logResetError) {
        console.error("Error deleting logs:", logResetError);
        throw logResetError;
      }
      
      // Add reset log
      const resetMessage = `${new Date().toLocaleString()}: ${currentUser} reset all data`;
      
      const { error: logInsertError } = await supabase
        .from('activity_logs')
        .insert({
          message: resetMessage
        });
      
      if (logInsertError) {
        console.error("Error adding reset log:", logInsertError);
        throw logInsertError;
      }
      
      console.log("Data reset successful");
      
      // Update local state
      setPersons(initialPersons);
      setActivityLog([resetMessage]);
      localStorage.setItem('students', JSON.stringify(initialPersons));
      localStorage.setItem('activityLog', JSON.stringify([resetMessage]));
      
      toast({
        title: "Data Reset",
        description: "All data has been reset to default values.",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error resetting data:", error);
      toast({
        title: "Reset Failed",
        description: "Could not reset the data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <PersonDataContext.Provider value={{ 
      persons, 
      updatePersonLevel, 
      updatePersonNotes, 
      resetAllData,
      activityLog
    }}>
      {children}
    </PersonDataContext.Provider>
  );
};

export const usePersonData = () => {
  const context = useContext(PersonDataContext);
  if (context === undefined) {
    throw new Error('usePersonData must be used within a PersonDataProvider');
  }
  return context;
};
