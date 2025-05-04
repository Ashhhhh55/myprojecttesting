
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePersonData } from "@/contexts/PersonDataContext";

interface NotesSectionProps {
  isGuest?: boolean;
}

const NotesSection = ({ isGuest = false }: NotesSectionProps) => {
  const { persons, updatePersonNotes } = usePersonData();
  const [selectedPersonId, setSelectedPersonId] = useState(persons[0]?.id.toString() || "1");
  const [notes, setNotes] = useState('');

  // Update notes when selected person changes
  useEffect(() => {
    const person = persons.find(s => s.id.toString() === selectedPersonId);
    if (person) {
      setNotes(person.notes);
    }
  }, [selectedPersonId, persons]);

  // Handle notes change
  const handleNotesChange = (value: string) => {
    if (isGuest) return;
    setNotes(value);
    updatePersonNotes(parseInt(selectedPersonId, 10), value);
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
            value={selectedPersonId} 
            onValueChange={setSelectedPersonId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select person" />
            </SelectTrigger>
            <SelectContent>
              {persons.map((person) => (
                <SelectItem key={person.id} value={person.id.toString()}>
                  <span className="arabic-text">{person.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Textarea 
            placeholder={isGuest ? "Notes are view-only in guest mode" : "Add notes for this person..."}
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
