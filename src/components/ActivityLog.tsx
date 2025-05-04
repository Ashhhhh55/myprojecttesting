
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePersonData } from "@/contexts/PersonDataContext";

const ActivityLog = () => {
  const { activityLog } = usePersonData();
  const [displayCount, setDisplayCount] = useState(5);
  
  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 5, activityLog.length));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {activityLog.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No activity yet
          </p>
        ) : (
          <div className="space-y-4">
            <ul className="space-y-2">
              {activityLog.slice(0, displayCount).map((log, index) => (
                <li key={index} className="text-sm py-1 border-b border-gray-100">
                  {log}
                </li>
              ))}
            </ul>
            
            {displayCount < activityLog.length && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  className="w-full md:w-auto"
                >
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
