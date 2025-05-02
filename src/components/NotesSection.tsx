
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStudentData } from "@/contexts/StudentDataContext";

interface NotesSectionProps {
  isGuest?: boolean;
}

const NotesSection = ({ isGuest = false }: NotesSectionProps) => {
  const { students, updateStudentNotes } = useStudentData();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id.toString() || "1");
  const [notes, setNotes] = useState('');

  // Update notes when selected student changes
  useEffect(() => {
    const student = students.find(s => s.id.toString() === selectedStudentId);
    if (student) {
      setNotes(student.notes);
    }
  }, [selectedStudentId, students]);

  // Handle notes change
  const handleNotesChange = (value: string) => {
    if (isGuest) return;
    setNotes(value);
    updateStudentNotes(parseInt(selectedStudentId, 10), value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg md:text-xl arabic-text">ملاحظات</CardTitle>
        {isGuest && (
          <div className="text-sm text-amber-500">View-only mode</div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select 
            value={selectedStudentId} 
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  <span className="arabic-text">{student.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Textarea 
            placeholder={isGuest ? "Notes are view-only in guest mode" : "Add notes for this student..."}
            className="min-h-[120px]"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            disabled={isGuest}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
