
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonControls from "./PersonControls";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import ActivityLog from "./ActivityLog";
import OutsideGraph from "./OutsideGraph";
import NotesSection from "./NotesSection";
import Header from "./Header";
import { usePersonData } from "@/contexts/PersonDataContext";
import { useUser } from "@/contexts/UserContext";

interface DashboardProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Dashboard = ({ setIsLoggedIn }: DashboardProps) => {
  const { persons, resetAllData } = usePersonData();
  const { currentUser, isAdmin } = useUser();
  const [selectedPerson, setSelectedPerson] = useState(persons[0]);
  const isGuest = !isAdmin;

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isGuest');
    setIsLoggedIn(false);
  };

  // Update selectedPerson when persons are loaded
  if (selectedPerson === undefined && persons.length > 0) {
    setSelectedPerson(persons[0]);
  }

  if (persons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLogout={handleLogout} 
        onReset={resetAllData} 
        isGuest={isGuest} 
      />

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
                <PersonControls isGuest={isGuest} />
              </TabsContent>
              
              <TabsContent value="charts" className="space-y-4">
                <BarChart />
                <LineChart 
                  selectedPerson={selectedPerson} 
                  onPersonChange={setSelectedPerson}
                />
                <OutsideGraph />
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <NotesSection isGuest={isGuest} />
                <ActivityLog />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-12 gap-6">
            {/* Controls Section */}
            <div className="col-span-4">
              <PersonControls isGuest={isGuest} />
            </div>
            
            {/* Charts and Activity Section */}
            <div className="col-span-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart />
                <LineChart 
                  selectedPerson={selectedPerson} 
                  onPersonChange={setSelectedPerson}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OutsideGraph />
                <NotesSection isGuest={isGuest} />
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
