// src/components/LineChart.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePersonData, Person } from "@/contexts/PersonDataContext";

interface LineChartProps {
  selectedPerson: Person | null; // Allow null for initial state
  onPersonChange: (person: Person) => void;
}

const LineChart = ({ selectedPerson, onPersonChange }: LineChartProps) => {
  const { persons } = usePersonData();
  const [selectedValue, setSelectedValue] = useState<string>(selectedPerson?.id.toString() || "");

  // Find selected person if it doesn't exist
  useEffect(() => {
    if (!selectedPerson && persons.length > 0) {
      onPersonChange(persons[0]);
    }
  }, [selectedPerson, persons, onPersonChange]);

  const handleButtonClick = (number: number) => {
    console.log(`Button ${number} clicked`); // Replace with desired action
    // You can add logic here to handle the button click, e.g., changing the selected person
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg md:text-xl">Select a Number</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap justify-center">
          {Array.from({ length: 10 }, (_, index) => (
            <button
              key={index + 1}
              className="m-2 p-2 bg-blue-500 text-white rounded"
              onClick={() => handleButtonClick(index + 1)} // Handle button click
            >
              {index + 1}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;