
import { useStudentData } from "@/contexts/StudentDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BarChart = () => {
  const { students } = useStudentData();
  
  // Function to determine bar color based on level
  const getBarColor = (level: number) => {
    if (level === 0) return "bg-red-500"; // Zero level (red)
    if (level === 10) return "bg-green-500"; // Max level (green)
    return "bg-blue-500"; // Normal level (blue)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl arabic-text rtl">الجراف</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative h-64 md:h-80">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500 py-2">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} className="text-right pr-1">
                {10 - i}
              </span>
            ))}
          </div>
          
          {/* Chart area */}
          <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end justify-around">
            {students.map((student) => (
              <div key={student.id} className="flex flex-col items-center w-1/6">
                <div className="w-full flex-1 flex items-end justify-center pb-6">
                  <div 
                    className={`w-8 ${getBarColor(student.level)} rounded-t-sm transition-all duration-500 animate-bar-rise`}
                    style={{ 
                      "--bar-height": `${(student.level / 10) * 100}%`,
                      height: `${(student.level / 10) * 100}%`
                    } as React.CSSProperties}
                  ></div>
                </div>
                <span className="text-xs font-medium arabic-text">{student.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
