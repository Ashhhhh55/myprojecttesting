
import { useStudentData } from "@/contexts/StudentDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const StudentControls = () => {
  const { students, updateStudentLevel } = useStudentData();

  const handleSliderChange = (studentId: number, newValue: number[]) => {
    updateStudentLevel(studentId, newValue[0]);
  };

  const handleInputChange = (studentId: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateStudentLevel(studentId, numValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl arabic-text rtl">التحكم</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {students.map((student) => (
            <div key={student.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <Label 
                  htmlFor={`slider-${student.id}`}
                  className="text-md font-medium arabic-text rtl"
                >
                  {student.name}
                </Label>
                <Input
                  id={`input-${student.id}`}
                  type="number"
                  min="0"
                  max="10"
                  value={student.level}
                  onChange={(e) => handleInputChange(student.id, e.target.value)}
                  className="w-16 text-center"
                />
              </div>
              
              <Slider
                id={`slider-${student.id}`}
                defaultValue={[student.level]}
                max={10}
                step={1}
                value={[student.level]}
                onValueChange={(value) => handleSliderChange(student.id, value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentControls;
