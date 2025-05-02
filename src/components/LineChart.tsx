
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentData, Student } from "@/contexts/StudentDataContext";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  selectedStudent: Student;
  onStudentChange: (student: Student) => void;
}

const LineChart = ({ selectedStudent, onStudentChange }: LineChartProps) => {
  const { students } = useStudentData();
  
  // Find selected student if it doesn't exist
  useEffect(() => {
    if (!selectedStudent && students.length > 0) {
      onStudentChange(students[0]);
    }
  }, [selectedStudent, students, onStudentChange]);

  const handleStudentChange = (value: string) => {
    const student = students.find(s => s.id.toString() === value);
    if (student) {
      onStudentChange(student);
    }
  };

  // Convert history data to format expected by Recharts
  const chartData = selectedStudent?.history.map((value, index) => ({
    name: `${index + 1}`,
    value: value
  })) || [];

  if (!selectedStudent) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg md:text-xl">Line Graph</CardTitle>
        <Select 
          value={selectedStudent.id.toString()} 
          onValueChange={handleStudentChange}
        >
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
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart 
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={selectedStudent.name}
                stroke="#3b82f6" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
