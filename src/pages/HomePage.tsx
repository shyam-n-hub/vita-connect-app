
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HomePage = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      title: "Patient Registration",
      description: "Create an account and securely store your medical information",
      icon: "🧑‍⚕️",
    },
    {
      title: "Health Issue Reporting",
      description: "Submit your health concerns to qualified doctors",
      icon: "📝",
    },
    {
      title: "Doctor Consultation",
      description: "Receive professional medical advice and prescriptions",
      icon: "👨‍⚕️",
    },
    {
      title: "Medical History",
      description: "Access your complete record of consultations and treatments",
      icon: "📊",
    },
  ];

  const testimonials = [
    {
      quote: "This platform has made it so much easier to consult with doctors without leaving home.",
      author: "Sarah Johnson, Patient",
    },
    {
      quote: "I can efficiently review patient cases and provide timely responses through this system.",
      author: "Dr. Michael Brown, Cardiologist",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-50 hero-pattern py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Healthcare Management System
                </h1>
                <p className="text-lg text-gray-700 mb-8 max-w-lg">
                  Connect with healthcare professionals and manage your medical needs in one secure platform.
                </p>
                {currentUser ? (
                  <Button size="lg" asChild className="font-semibold">
                    <Link to={`/${currentUser.userType}-dashboard`}>
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <div className="space-x-4">
                    <Button size="lg" asChild className="font-semibold">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="font-semibold">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                  alt="Healthcare professionals" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">Key Features</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Our comprehensive platform offers everything you need to manage your healthcare effectively.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-semibold text-xl">1</div>
                <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
                <p className="text-gray-600">Sign up as a patient or doctor and complete your profile.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-semibold text-xl">2</div>
                <h3 className="text-xl font-semibold mb-3">Submit Health Issues</h3>
                <p className="text-gray-600">Patients can describe their symptoms and health concerns.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-semibold text-xl">3</div>
                <h3 className="text-xl font-semibold mb-3">Receive Care</h3>
                <p className="text-gray-600">Doctors review cases and provide prescriptions and recommendations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-4xl text-primary mb-4">"</div>
                    <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                    <p className="text-gray-600 font-medium">— {testimonial.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our platform today and experience a new way of managing your healthcare needs.
            </p>
            {!currentUser && (
              <Button 
                size="lg" 
                variant="secondary" 
                asChild 
                className="font-semibold"
              >
                <Link to="/signup">Create an Account</Link>
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
