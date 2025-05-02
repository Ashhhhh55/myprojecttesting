
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentControls from "./StudentControls";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import ActivityLog from "./ActivityLog";
import OutsideGraph from "./OutsideGraph";
import NotesSection from "./NotesSection";
import Header from "./Header";
import { useStudentData } from "@/contexts/StudentDataContext";

interface DashboardProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Dashboard = ({ setIsLoggedIn }: DashboardProps) => {
  const { students, resetAllData } = useStudentData();
  const [selectedStudent, setSelectedStudent] = useState(students[0]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} onReset={resetAllData} />

      <div className="container py-6">
        <div className="grid gap-6">
          {/* Main content on large screens, tabbed on small screens */}
          <div className="block md:hidden">
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="controls" className="space-y-4">
                <StudentControls />
              </TabsContent>
              
              <TabsContent value="charts" className="space-y-4">
                <BarChart />
                <LineChart 
                  selectedStudent={selectedStudent} 
                  onStudentChange={setSelectedStudent}
                />
                <OutsideGraph />
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <NotesSection />
                <ActivityLog />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-12 gap-6">
            {/* Controls Section */}
            <div className="col-span-4">
              <StudentControls />
            </div>
            
            {/* Charts and Activity Section */}
            <div className="col-span-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart />
                <LineChart 
                  selectedStudent={selectedStudent} 
                  onStudentChange={setSelectedStudent}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OutsideGraph />
                <NotesSection />
              </div>
              <ActivityLog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
