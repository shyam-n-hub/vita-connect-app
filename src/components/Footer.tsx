
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-50 pt-12 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-primary font-bold text-xl mb-4"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">H+</span>
              </div>
              <span>HealthCare</span>
            </Link>
            <p className="text-gray-600 max-w-md">
              Improving healthcare access through technology. Our platform connects patients with doctors 
              for seamless remote consultations and care.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link to="/login" className="text-gray-600 hover:text-primary">Login</Link></li>
              <li><Link to="/signup" className="text-gray-600 hover:text-primary">Sign Up</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-gray-600">
              <p>123 Healthcare Blvd</p>
              <p>Medical District, MD 20814</p>
              <p>contact@healthcare-platform.com</p>
              <p>(555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2023 HealthCare Platform. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
