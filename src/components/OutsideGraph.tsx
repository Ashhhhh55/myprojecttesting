
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentData } from "@/contexts/StudentDataContext";

const OutsideGraph = () => {
  const { students } = useStudentData();
  
  // Get students with level 0
  const zeroLevelStudents = students.filter(student => student.level === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl arabic-text rtl">برا الجراف</CardTitle>
      </CardHeader>
      <CardContent>
        {zeroLevelStudents.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No students outside graph
          </p>
        ) : (
          <ul className="divide-y">
            {zeroLevelStudents.map(student => (
              <li key={student.id} className="py-2 flex justify-between">
                <span className="arabic-text rtl">{student.name}</span>
                <span className="font-medium">
                  {student.zeroCount} {student.zeroCount === 1 ? 'time' : 'times'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default OutsideGraph;
