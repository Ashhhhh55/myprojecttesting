
import { usePersonData } from "@/contexts/PersonDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const BarChart = () => {
  const { persons } = usePersonData();
  
  // Function to determine bar color based on level
  const getBarColor = (level: number) => {
    if (level === 0) return "bg-red-500"; // Zero level (red)
    if (level === 10) return "bg-green-500"; // Max level (green)
    return "bg-blue-500"; // Normal level (blue)
  };

  // Console log for debugging
  console.log("BarChart rendering with persons:", persons);

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
            {persons.length > 0 ? persons.map((person) => (
              <div key={person.id} className="flex flex-col items-center w-1/6">
                <div className="w-full flex-1 flex items-end justify-center pb-6">
                  <div 
                    className={`w-8 ${getBarColor(person.level)} rounded-t-sm`}
                    style={{ 
                      height: `${(person.level / 10) * 100}%`,
                      minHeight: '4px', // Ensure bars are visible even at level 0
                      transition: 'height 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
                <span className="text-xs font-medium arabic-text">{person.name}</span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
