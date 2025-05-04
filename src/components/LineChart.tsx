import { useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePersonData, Person } from "@/contexts/PersonDataContext";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  selectedPerson: Person | null; // Allow null for initial state
  onPersonChange: (person: Person) => void;
}

// Simple debounce function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const LineChart = ({ selectedPerson, onPersonChange }: LineChartProps) => {
  const { persons } = usePersonData();
  
  // Find selected person if it doesn't exist
  useEffect(() => {
    if (!selectedPerson && persons.length > 0) {
      onPersonChange(persons[0]);
    }
  }, [selectedPerson, persons, onPersonChange]);

  const handlePersonChange = useCallback(debounce((value: string) => {
    const newPerson = persons.find((p) => p.id.toString() === value);
    if (newPerson) {
      // Check if the new person's level is different from the selected person's level
      if (newPerson.id !== selectedPerson?.id && newPerson.level !== selectedPerson?.level) {
        onPersonChange(newPerson); // Only call if person actually changed and level is different
      }
    }
  }, 300), [persons, selectedPerson, onPersonChange]); // Adjust the delay as needed

  // Convert history data to format expected by Recharts
  const chartData =
    selectedPerson?.history.map((value, index) => ({
      name: `${index + 1}`,
      value: value
    })) || [];

  if (!selectedPerson) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg md:text-xl">Line Graph</CardTitle>
        <Select 
          value={selectedPerson.id.toString()} 
          onValueChange={handlePersonChange}
        >
          <SelectTrigger className="w-[180px]">
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
                name={selectedPerson.name}
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