
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentData, Student } from "@/contexts/StudentDataContext";

Chart.register(...registerables);

interface LineChartProps {
  selectedStudent: Student;
  onStudentChange: (student: Student) => void;
}

const LineChart = ({ selectedStudent, onStudentChange }: LineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { students } = useStudentData();
  
  // Find selected student if it doesn't exist
  useEffect(() => {
    if (!selectedStudent && students.length > 0) {
      onStudentChange(students[0]);
    }
  }, [selectedStudent, students, onStudentChange]);

  useEffect(() => {
    if (!chartRef.current || !selectedStudent) return;

    const ctx = chartRef.current.getContext('2d');
    
    if (!ctx) return;
    
    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: selectedStudent.history.map((_, i) => `${i + 1}`),
        datasets: [{
          label: selectedStudent.name,
          data: selectedStudent.history,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.2,
          borderWidth: 2,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });

    // Clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedStudent]);

  const handleStudentChange = (value: string) => {
    const student = students.find(s => s.id.toString() === value);
    if (student) {
      onStudentChange(student);
    }
  };

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
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
