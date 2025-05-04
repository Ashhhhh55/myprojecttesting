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

  const handleSliderCommit = (personId: number, newValue: number[]) => {
    const newLevel = newValue[0];
    const person = persons.find(p => p.id === personId);

    // Only update and log if the level has actually changed
    if (person && person.level !== newLevel) {
      updatePersonLevel(personId, newLevel);
      // Log the activity only if the level has changed
      addActivityLog(`Malak changed ${person.name}'s level to ${newLevel}`);
    }
  };

  const handleInputChange = (personId: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const person = persons.find(p => p.id === personId);
      if (person && person.level !== numValue) {
        updatePersonLevel(personId, numValue);
        addActivityLog(`Malak changed ${person.name}'s level to ${numValue}`);
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
                defaultValue={[person.level]}
                max={10}
                step={1}
                value={[person.level]}
                onValueCommit={(value) => handleSliderCommit(person.id, value)} // Trigger only when the user commits to a value
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
