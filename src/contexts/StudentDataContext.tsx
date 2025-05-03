
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: number;
  name: string;
  level: number;
  history: number[];
  notes: string;
  zeroCount: number;
}

interface StudentDataContextType {
  students: Student[];
  updateStudentLevel: (studentId: number, newLevel: number) => void;
  updateStudentNotes: (studentId: number, notes: string) => void;
  resetAllData: () => void;
  activityLog: string[];
}

const StudentDataContext = createContext<StudentDataContextType | undefined>(undefined);

const initialStudents: Student[] = [
  { id: 1, name: 'يوسف', level: 5, history: [5], notes: '', zeroCount: 0 },
  { id: 2, name: 'نور', level: 4, history: [4], notes: '', zeroCount: 0 },
  { id: 3, name: 'علي', level: 3, history: [3], notes: '', zeroCount: 0 },
  { id: 4, name: 'محمود', level: 2, history: [2], notes: '', zeroCount: 0 },
  { id: 5, name: 'كريم', level: 1, history: [1], notes: '', zeroCount: 0 },
];

export const StudentDataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const { currentUser, isAdmin } = useUser();
  
  // Load data on component mount - from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load students from Supabase
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .order('id');
        
        if (studentsError) throw studentsError;
        
        // Load activity logs from Supabase
        const { data: logsData, error: logsError } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (logsError) throw logsError;
        
        // Format students data to match our interface
        const formattedStudents = studentsData.map(student => ({
          id: student.id,
          name: student.name,
          level: student.level,
          history: student.history,
          notes: student.notes,
          zeroCount: student.zero_count
        }));
        
        // Format logs data to match our interface
        const formattedLogs = logsData.map(log => log.message);
        
        setStudents(formattedStudents);
        setActivityLog(formattedLogs);
        
        console.log("Loaded data from Supabase");
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        
        // Fallback to localStorage if Supabase fails
        const savedStudents = localStorage.getItem('students');
        const savedActivityLog = localStorage.getItem('activityLog');
        
        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        } else {
          setStudents(initialStudents);
          localStorage.setItem('students', JSON.stringify(initialStudents));
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

  const updateStudentLevel = async (studentId: number, newLevel: number) => {
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
      // Find the student to update
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const wasZero = student.level === 0;
      const isZero = newLevel === 0;
      
      // Update zero count if needed
      let zeroCount = student.zeroCount;
      if (isZero && !wasZero) {
        zeroCount += 1;
      }
      
      // Update the student in the database
      const { error: updateError } = await supabase
        .from('students')
        .update({
          level: newLevel,
          history: [...student.history, newLevel],
          zero_count: zeroCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId);
      
      if (updateError) throw updateError;
      
      // Log the activity in the database
      const activityMessage = `${new Date().toLocaleString()}: ${currentUser} changed ${student.name}'s level to ${newLevel}`;
      
      const { error: logError } = await supabase
        .from('activity_logs')
        .insert({
          message: activityMessage,
        });
      
      if (logError) throw logError;
      
      // Update the local state
      setStudents(prevStudents => {
        const updatedStudents = prevStudents.map(s => {
          if (s.id === studentId) {
            return {
              ...s,
              level: newLevel,
              history: [...s.history, newLevel],
              zeroCount: zeroCount
            };
          }
          return s;
        });
        
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        return updatedStudents;
      });
      
      setActivityLog(prev => {
        const updated = [activityMessage, ...prev];
        localStorage.setItem('activityLog', JSON.stringify(updated));
        return updated;
      });
      
      toast({
        title: "Level Updated",
        description: `${student.name}'s level is now ${newLevel}`,
      });
    } catch (error) {
      console.error("Error updating student level:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the student level. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateStudentNotes = async (studentId: number, notes: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Guest users cannot modify notes. Please login as admin.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update the student notes in the database
      const { error } = await supabase
        .from('students')
        .update({
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId);
      
      if (error) throw error;
      
      // Update the local state
      setStudents(prevStudents => {
        const updatedStudents = prevStudents.map(student => {
          if (student.id === studentId) {
            return { ...student, notes };
          }
          return student;
        });
        
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        return updatedStudents;
      });
      
      toast({
        title: "Notes Updated",
        description: "Student notes have been saved.",
      });
    } catch (error) {
      console.error("Error updating student notes:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the student notes. Please try again.",
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
      // Reset students table in the database
      const { error: truncateError } = await supabase
        .from('students')
        .delete()
        .not('id', 'is', null);
      
      if (truncateError) throw truncateError;
      
      // Insert initial data
      const { error: insertError } = await supabase
        .from('students')
        .insert(
          initialStudents.map(student => ({
            id: student.id,
            name: student.name,
            level: student.level,
            history: student.history,
            notes: student.notes,
            zero_count: student.zeroCount
          }))
        );
      
      if (insertError) throw insertError;
      
      // Reset activity logs
      const { error: logResetError } = await supabase
        .from('activity_logs')
        .delete()
        .not('id', 'is', null);
      
      if (logResetError) throw logResetError;
      
      // Add reset log
      const resetMessage = `${new Date().toLocaleString()}: ${currentUser} reset all data`;
      
      const { error: logInsertError } = await supabase
        .from('activity_logs')
        .insert({
          message: resetMessage
        });
      
      if (logInsertError) throw logInsertError;
      
      // Update local state
      setStudents(initialStudents);
      setActivityLog([resetMessage]);
      localStorage.setItem('students', JSON.stringify(initialStudents));
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
    <StudentDataContext.Provider value={{ 
      students, 
      updateStudentLevel, 
      updateStudentNotes, 
      resetAllData,
      activityLog
    }}>
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentData = () => {
  const context = useContext(StudentDataContext);
  if (context === undefined) {
    throw new Error('useStudentData must be used within a StudentDataProvider');
  }
  return context;
};
