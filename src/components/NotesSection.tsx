
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentData } from "@/contexts/StudentDataContext";
import { toast } from "@/components/ui/use-toast";

const NotesSection = () => {
  const { students, updateStudentNotes } = useStudentData();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id.toString() || "1");
  const [noteText, setNoteText] = useState<string>("");

  const handleStudentChange = (value: string) => {
    setSelectedStudentId(value);
    const student = students.find(s => s.id.toString() === value);
    if (student) {
      setNoteText(student.notes || "");
    }
  };

  const handleSaveNotes = () => {
    updateStudentNotes(parseInt(selectedStudentId), noteText);
    toast({
      title: "Notes Saved",
      description: "Student notes have been updated successfully.",
    });
  };

  // Load notes when component mounts or student changes
  useState(() => {
    const student = students.find(s => s.id.toString() === selectedStudentId);
    if (student) {
      setNoteText(student.notes || "");
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg md:text-xl arabic-text rtl">ملاحظات</CardTitle>
        <Select value={selectedStudentId} onValueChange={handleStudentChange}>
          <SelectTrigger className="w-[180px]">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Add notes for this student..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button onClick={handleSaveNotes} className="w-full">Save Notes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
