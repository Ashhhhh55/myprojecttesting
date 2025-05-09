import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePersonData } from "@/contexts/PersonDataContext";
import { useUser } from '@/contexts/UserContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { FileText, Headphones, Volume, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesSectionProps {
  isGuest?: boolean;
}

const NotesSection = ({ isGuest = false }: NotesSectionProps) => {
  const { persons, updatePersonAdminNotes } = usePersonData();
  const { currentUser } = useUser();
  const [selectedPersonId, setSelectedPersonId] = useState(persons[0]?.id.toString() || "1");
  const [adminNotes, setAdminNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update notes when selected person changes
  useEffect(() => {
    const person = persons.find(s => s.id.toString() === selectedPersonId);
    if (person) {
      // Set admin notes if available for current user
      if (person.adminNotes && currentUser && person.adminNotes[currentUser]) {
        setAdminNotes(person.adminNotes[currentUser]);
      } else {
        setAdminNotes('');
      }
    }
  }, [selectedPersonId, persons, currentUser]);

  // Handle admin-specific notes change
  const handleAdminNotesChange = (value: string) => {
    if (isGuest || !currentUser) return;
    setAdminNotes(value);
    updatePersonAdminNotes(parseInt(selectedPersonId, 10), currentUser, value);
  };

  // Get all admin notes for the selected person
  const getAdminNotesList = () => {
    const person = persons.find(s => s.id.toString() === selectedPersonId);
    if (!person || !person.adminNotes) return [];
    
    return Object.entries(person.adminNotes)
      .filter(([admin, note]) => admin !== currentUser && note.trim() !== '')
      .map(([admin, note]) => ({
        admin,
        note
      }));
  };

  // Toggle audio playback
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio playback error:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Audio playback ended handler
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const audioUrl = "Ashhhhh55/myprojecttesting/src/components/sound/Habobty.mp3";
  const adminNotesList = getAdminNotesList();

  return (
    <div className="space-y-4">
      {/* Person Selection */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg md:text-xl arabic-text">ملاحظات</CardTitle>
          {isGuest && (
            <div className="text-sm text-amber-500">View-only mode</div>
          )}
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
          
      {/* Voice Note Section - Now as a separate card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Voice Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <audio 
            ref={audioRef}
            src={audioUrl} 
            onEnded={handleAudioEnded}
            className="hidden"
          />
          <Button 
            onClick={togglePlayAudio} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <VolumeX className="h-4 w-4" />
                Stop Playing
              </>
            ) : (
              <>
                <Volume className="h-4 w-4" />
                Play Voice Note
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Admin Notes Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg md:text-xl">Admin Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Admin Specific Notes */}
          {!isGuest && currentUser && currentUser !== 'Guest' && (
            <div className="space-y-2">
              <Label htmlFor="admin-notes">Your Notes ({currentUser})</Label>
              <Textarea 
                id="admin-notes"
                placeholder="Add your personal admin notes here..."
                className="min-h-[80px] border-dashed border-blue-300"
                value={adminNotes}
                onChange={(e) => handleAdminNotesChange(e.target.value)}
              />
            </div>
          )}
          
          {/* Other Admins' Notes */}
          {adminNotesList.length > 0 && (
            <Collapsible className="w-full space-y-2">
              <CollapsibleTrigger className="flex items-center gap-2 px-4 py-2 w-full bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                <FileText className="h-4 w-4" />
                <span>Other Admin Notes ({adminNotesList.length})</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {adminNotesList.map(({ admin, note }) => (
                  <div key={admin} className="border rounded-md p-3">
                    <div className="font-medium text-sm text-blue-600 mb-1">{admin}:</div>
                    <div className="text-sm whitespace-pre-wrap">{note}</div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesSection;
