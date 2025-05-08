
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const mainMenuItems = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];

  const authMenuItems = currentUser
    ? [
        { 
          name: `${currentUser.userType === 'doctor' ? 'Doctor' : 'Patient'} Dashboard`, 
          path: `/${currentUser.userType}-dashboard` 
        },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Sign Up", path: "/signup" },
      ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary font-bold text-xl"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">H+</span>
          </div>
          <span>HealthCare</span>
        </Link>

        {/* Mobile menu button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8">
              {mainMenuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className="py-2 px-4 hover:bg-blue-50 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
              {authMenuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className="py-2 px-4 hover:bg-blue-50 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
              {currentUser && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  Logout
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {mainMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          {authMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          {currentUser && (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
          {!currentUser && (
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
