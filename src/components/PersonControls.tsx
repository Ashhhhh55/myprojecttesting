
import { usePersonData } from "@/contexts/PersonDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface PersonControlsProps {
  isGuest?: boolean;
}

const PersonControls = ({ isGuest = false }: PersonControlsProps) => {
  const { persons, updatePersonLevel } = usePersonData();
  // Track the currently dragging slider's value to avoid multiple updates
  const [draggingValues, setDraggingValues] = useState<Record<number, number>>({});

  // This function is only called once when the slider drag ends
  const handleSliderCommit = (personId: number, newValue: number[]) => {
    const currentLevel = persons.find(p => p.id === personId)?.level;
    const newLevel = newValue[0];
    
    // Only update if the value actually changed to avoid duplicate logs
    if (currentLevel !== newLevel) {
      updatePersonLevel(personId, newLevel);
    }
    
    // Clear dragging state
    setDraggingValues(prev => {
      const updated = {...prev};
      delete updated[personId];
      return updated;
    });
  };

  // Update the temporary dragging value without committing to database
  const handleSliderChange = (personId: number, newValue: number[]) => {
    setDraggingValues(prev => ({
      ...prev,
      [personId]: newValue[0]
    }));
  };

  const handleInputChange = (personId: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updatePersonLevel(personId, numValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl arabic-text rtl">التحكم</CardTitle>
        {isGuest && (
          <div className="text-sm text-amber-500">View-only mode</div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {persons.map((person) => {
            // Use dragging value if available, otherwise use person's level
            const displayValue = draggingValues[person.id] !== undefined 
              ? draggingValues[person.id] 
              : person.level;
            
            return (
              <div key={person.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label 
                    htmlFor={`slider-${person.id}`}
                    className="text-md font-medium arabic-text rtl"
                  >
                    {person.name}
                  </Label>
                  <Input
                    id={`input-${person.id}`}
                    type="number"
                    min="0"
                    max="10"
                    value={displayValue}
                    onChange={(e) => handleInputChange(person.id, e.target.value)}
                    className="w-16 text-center"
                    disabled={isGuest}
                  />
                </div>
                
                <Slider
                  id={`slider-${person.id}`}
                  defaultValue={[person.level]}
                  max={10}
                  step={1}
                  value={[displayValue]}
                  onValueChange={(value) => handleSliderChange(person.id, value)} // Update visual only
                  onValueCommit={(value) => handleSliderCommit(person.id, value)} // Only commit value when drag ends
                  className={`w-full ${isGuest ? "opacity-70 cursor-not-allowed" : ""}`}
                  disabled={isGuest}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonControls;
