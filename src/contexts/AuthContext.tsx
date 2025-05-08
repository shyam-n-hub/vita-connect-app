
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  userType: "patient" | "doctor";
  name: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: "patient" | "doctor") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for our mock auth system
const demoUsers = [
  { id: '1', email: 'doctor@example.com', password: 'password', name: 'Dr. Smith', userType: 'doctor' },
  { id: '2', email: 'patient@example.com', password: 'password', name: 'John Doe', userType: 'patient' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("healthCareUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function - simulating Firebase auth with local data
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Find user in our demo data
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create a user object without the password
      const authUser = {
        id: user.id,
        email: user.email,
        userType: user.userType as "patient" | "doctor",
        name: user.name
      };
      
      // Store user in localStorage
      localStorage.setItem("healthCareUser", JSON.stringify(authUser));
      setCurrentUser(authUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${authUser.name}!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function - simulating Firebase auth with local data
  const signup = async (email: string, password: string, name: string, userType: "patient" | "doctor") => {
    try {
      setLoading(true);
      
      // Check if user already exists
      const existingUser = demoUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: `${demoUsers.length + 1}`,
        email,
        password,
        name,
        userType
      };
      
      // Add to demo users (this would be persisted in a real app)
      demoUsers.push(newUser);
      
      // Create a user object without the password
      const authUser = {
        id: newUser.id,
        email: newUser.email,
        userType: newUser.userType as "patient" | "doctor",
        name: newUser.name
      };
      
      // Store user in localStorage
      localStorage.setItem("healthCareUser", JSON.stringify(authUser));
      setCurrentUser(authUser);
      
      toast({
        title: "Account created successfully",
        description: `Welcome, ${authUser.name}!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem("healthCareUser");
    setCurrentUser(null);
    toast({
      title: "Logged out successfully",
    });
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
