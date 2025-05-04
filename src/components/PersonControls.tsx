import { usePersonData } from "@/contexts/PersonDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PersonControlsProps {
  isGuest?: boolean;
}

const PersonControls = ({ isGuest = false }: PersonControlsProps) => {
  const { persons, updatePersonLevel, addActivityLog } = usePersonData();

  const handleSliderChange = (personId: number, newValue: number[]) => {
    const newLevel = newValue[0];
    const person = persons.find(p => p.id === personId);
    
    if (person && person.level !== newLevel) {
      // Update the local state and call database update function
      updatePersonLevel(personId, newLevel);  // API call to update database
      addActivityLog(`Malak changed ${person.name}'s level to ${newLevel}`);  // Log change
    }
  };

  const handleInputChange = (personId: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const person = persons.find(p => p.id === personId);
      if (person && person.level !== numValue) {
        // Update the local state and call database update function
        updatePersonLevel(personId, numValue);  // API call to update database
        addActivityLog(`Malak changed ${person.name}'s level to ${numValue}`);  // Log change
      }
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
          {persons.map((person) => (
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
                  value={person.level}
                  onChange={(e) => handleInputChange(person.id, e.target.value)}
                  className="w-16 text-center"
                  disabled={isGuest}
                />
              </div>
              
              <Slider
                id={`slider-${person.id}`}
                value={[person.level]} // Track the value properly
                max={10}
                step={1}
                onValueChange={(value) => handleSliderChange(person.id, value)} // Handle value change directly
                onValueCommit={(value) => handleSliderChange(person.id, value)} // Handle when the user commits
                className={`w-full ${isGuest ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isGuest}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonControls;
