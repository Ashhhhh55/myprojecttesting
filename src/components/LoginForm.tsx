
import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";

// List of valid users
const validUsers = [
  { username: 'Malak', password: 'admin123' },
  { username: 'Jana', password: 'admin123' },
  { username: 'Habiba', password: 'admin123' },
  { username: 'Mariam', password: 'admin123' },
  { username: 'Menna', password: 'admin123' },
];

interface LoginFormProps {
  setIsLoggedIn: (value: boolean) => void;
}

const LoginForm = ({ setIsLoggedIn }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { toast } = useToast();
  const { setCurrentUser } = useUser();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const user = validUsers.find(
      user => user.username === username && user.password === password
    );
    
    if (user) {
      setCurrentUser(username);
      localStorage.setItem('isLoggedIn', 'true');
      
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      setIsLoggedIn(true);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${username}! You can now edit student levels.`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinueAsGuest = () => {
    setCurrentUser("Guest");
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isGuest', 'true');
    setIsLoggedIn(true);
    
    toast({
      title: "Welcome Guest",
      description: "You can view the dashboard but cannot make changes.",
    });
  };

  const toggleLoginForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">ألجراف</CardTitle>
          <CardDescription>
            View the dashboard or login as admin to make changes
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!showLogin ? (
            <div className="space-y-4">
              <Button 
                type="button" 
                onClick={toggleLoginForm} 
                className="w-full"
              >
                Login as Admin
              </Button>
              <Button 
                type="button" 
                onClick={handleContinueAsGuest}
                variant="outline" 
                className="w-full"
              >
                Continue as Guest
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => {
                    setRememberMe(checked as boolean);
                  }} 
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              
              <div className="space-y-2">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button 
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowLogin(false)}
                >
                  Back
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
