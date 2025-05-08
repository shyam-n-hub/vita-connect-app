
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addHealthRecord, getPatientRecords } from "../services/databaseService";
import { useToast } from "@/components/ui/use-toast";

interface HealthRecord {
  id: string;
  patientId: string;
  patientName: string;
  problem: string;
  dateSubmitted: string;
  status: 'pending' | 'responded';
  prescription?: string;
  doctorId?: string;
  doctorName?: string;
}

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [healthProblem, setHealthProblem] = useState("");
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchRecords();
    }
  }, [currentUser]);

  const fetchRecords = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const patientRecords = await getPatientRecords(currentUser.id);
      setRecords(patientRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your health records. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!healthProblem.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please describe your health problem",
      });
      return;
    }

    if (!currentUser) return;

    setSubmitting(true);
    try {
      await addHealthRecord({
        patientId: currentUser.id,
        patientName: currentUser.name,
        problem: healthProblem
      });

      toast({
        title: "Success",
        description: "Your health problem has been submitted.",
      });

      setHealthProblem("");
      fetchRecords();
    } catch (error) {
      console.error("Error submitting health problem:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your health problem. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold mr-4">
                {currentUser?.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-lg">{currentUser?.name}</p>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="new-problem" className="space-y-6">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="new-problem">New Problem</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new-problem">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Health Problem</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="healthProblem">Describe your health problem</Label>
                      <Textarea 
                        id="healthProblem"
                        value={healthProblem}
                        onChange={(e) => setHealthProblem(e.target.value)}
                        placeholder="Please describe your symptoms and any relevant health information..."
                        className="min-h-[150px]"
                      />
                    </div>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Your Health Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="py-8 flex justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : records.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      You have no health records yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {records.map((record) => (
                        <div 
                          key={record.id} 
                          className={`border p-4 rounded-md ${
                            record.status === 'responded' ? 'bg-blue-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">Health Problem</h3>
                            <span className="text-sm text-gray-500">{record.dateSubmitted}</span>
                          </div>
                          <p className="text-gray-700 mb-4">{record.problem}</p>
                          
                          {record.status === 'responded' ? (
                            <div className="mt-4 border-t pt-4">
                              <h4 className="font-semibold mb-1">Doctor's Response</h4>
                              <p className="text-gray-700">{record.prescription}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Response from {record.doctorName}
                              </p>
                            </div>
                          ) : (
                            <div className="px-3 py-2 bg-yellow-50 text-yellow-800 rounded-md text-sm inline-flex items-center">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              Awaiting doctor's response
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatientDashboard;
