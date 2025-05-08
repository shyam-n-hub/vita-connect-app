
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAllRecords, updateHealthRecord } from "../services/databaseService";
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

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [prescription, setPrescription] = useState("");
  const [submittingPrescription, setSubmittingPrescription] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
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
      const allRecords = await getAllRecords();
      setRecords(allRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load patient records. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (record: HealthRecord) => {
    setSelectedRecord(record);
    setPrescription("");
    setIsDialogOpen(true);
  };

  const handleSubmitPrescription = async () => {
    if (!selectedRecord || !prescription.trim() || !currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prescription",
      });
      return;
    }

    setSubmittingPrescription(true);
    try {
      await updateHealthRecord(selectedRecord.id, {
        prescription,
        doctorId: currentUser.id,
        doctorName: currentUser.name,
        status: 'responded',
      });

      toast({
        title: "Success",
        description: "Prescription submitted successfully",
      });

      setIsDialogOpen(false);
      fetchRecords();
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit prescription. Please try again.",
      });
    } finally {
      setSubmittingPrescription(false);
    }
  };

  const pendingRecords = records.filter(r => r.status === 'pending');
  const displayRecords = activeTab === 'pending' ? pendingRecords : records;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
          
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
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Patient Records</CardTitle>
                  <CardDescription>
                    {activeTab === 'pending' 
                      ? `${pendingRecords.length} patients waiting for your response`
                      : `${records.length} total records`
                    }
                  </CardDescription>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button 
                    variant={activeTab === 'pending' ? "default" : "outline"}
                    onClick={() => setActiveTab('pending')}
                    size="sm"
                  >
                    Pending
                    {pendingRecords.length > 0 && (
                      <span className="ml-2 bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {pendingRecords.length}
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant={activeTab === 'all' ? "default" : "outline"}
                    onClick={() => setActiveTab('all')}
                    size="sm"
                  >
                    All Records
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : displayRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {activeTab === 'pending' 
                    ? "No pending patient records."
                    : "No patient records found."
                  }
                </div>
              ) : (
                <div className="space-y-4">
                  {displayRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className={`border p-4 rounded-md ${
                        record.status === 'pending' ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{record.patientName}</h3>
                        <span className="text-sm text-gray-500">{record.dateSubmitted}</span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm text-gray-500 mb-1">Health Problem</h4>
                        <p className="text-gray-700">{record.problem}</p>
                      </div>
                      
                      {record.status === 'responded' ? (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm text-gray-500 mb-1">Prescribed Treatment</h4>
                          <p className="text-gray-700">{record.prescription}</p>
                        </div>
                      ) : (
                        <Button 
                          variant="default" 
                          onClick={() => handleRespond(record)}
                        >
                          Respond
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Prescribe Treatment</DialogTitle>
                <DialogDescription>
                  You are responding to {selectedRecord?.patientName}'s health issue.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h3 className="font-medium mb-2">Patient's Problem:</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedRecord?.problem}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Prescription:</h3>
                <Textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Enter your treatment plan, medication, and advice..."
                  className="min-h-[150px]"
                />
              </div>

              <DialogFooter className="flex space-x-2 justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleSubmitPrescription}
                  disabled={submittingPrescription}
                >
                  {submittingPrescription ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Prescription"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
