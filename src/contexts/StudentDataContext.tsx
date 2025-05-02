
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useUser } from './UserContext';

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
  const { currentUser } = useUser();

  useEffect(() => {
    // Load data from localStorage
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
  }, []);

  const updateStudentLevel = (studentId: number, newLevel: number) => {
    if (newLevel < 0) newLevel = 0;
    if (newLevel > 10) newLevel = 10;

    setStudents(prevStudents => {
      const updatedStudents = prevStudents.map(student => {
        if (student.id === studentId) {
          const wasZero = student.level === 0;
          const isZero = newLevel === 0;
          
          // Update zero count if needed
          let zeroCount = student.zeroCount;
          if (isZero && !wasZero) {
            zeroCount += 1;
          }
          
          return {
            ...student,
            level: newLevel,
            history: [...student.history, newLevel],
            zeroCount: zeroCount
          };
        }
        return student;
      });
      
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      return updatedStudents;
    });

    // Log the activity
    const student = students.find(s => s.id === studentId);
    if (student && currentUser) {
      const newActivity = `${new Date().toLocaleString()}: ${currentUser} changed ${student.name}'s level to ${newLevel}`;
      
      setActivityLog(prev => {
        const updated = [newActivity, ...prev];
        localStorage.setItem('activityLog', JSON.stringify(updated));
        return updated;
      });
      
      toast({
        title: "Level Updated",
        description: `${student.name}'s level is now ${newLevel}`,
      });
    }
  };

  const updateStudentNotes = (studentId: number, notes: string) => {
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
  };

  const resetAllData = () => {
    localStorage.removeItem('students');
    localStorage.removeItem('activityLog');
    setStudents(initialStudents);
    setActivityLog([]);
    localStorage.setItem('students', JSON.stringify(initialStudents));
    
    toast({
      title: "Data Reset",
      description: "All data has been reset to default values.",
      variant: "destructive"
    });
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
