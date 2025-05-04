
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePersonData } from "@/contexts/PersonDataContext";

const OutsideGraph = () => {
  const { persons } = usePersonData();
  
  // Get persons with level 0
  const zeroLevelPersons = persons.filter(person => person.level === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl arabic-text rtl">برا الجراف</CardTitle>
      </CardHeader>
      <CardContent>
        {zeroLevelPersons.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No persons outside graph
          </p>
        ) : (
          <ul className="divide-y">
            {zeroLevelPersons.map(person => (
              <li key={person.id} className="py-2 flex justify-between">
                <span className="arabic-text rtl">{person.name}</span>
                <span className="font-medium">
                  {person.zeroCount} {person.zeroCount === 1 ? 'time' : 'times'}
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
