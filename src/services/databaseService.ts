
// This service simulates Firebase Realtime Database functionality

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

// Mock database
let healthRecords: HealthRecord[] = [
  {
    id: '1',
    patientId: '2',
    patientName: 'John Doe',
    problem: 'Severe headache and fever for 3 days',
    dateSubmitted: '2023-05-15',
    status: 'responded',
    prescription: 'Paracetamol 500mg 3 times daily for 5 days',
    doctorId: '1',
    doctorName: 'Dr. Smith'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'John Doe',
    problem: 'Sore throat and cough',
    dateSubmitted: '2023-05-10',
    status: 'pending'
  }
];

// Get patient records by patient ID
export const getPatientRecords = (patientId: string): Promise<HealthRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredRecords = healthRecords.filter(record => record.patientId === patientId);
      resolve(filteredRecords);
    }, 500); // Simulate network delay
  });
};

// Get all records for doctors
export const getAllRecords = (): Promise<HealthRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(healthRecords);
    }, 500); // Simulate network delay
  });
};

// Add a new health record
export const addHealthRecord = (record: Omit<HealthRecord, 'id' | 'dateSubmitted' | 'status'>): Promise<HealthRecord> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecord: HealthRecord = {
        ...record,
        id: `${healthRecords.length + 1}`,
        dateSubmitted: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      healthRecords = [...healthRecords, newRecord];
      resolve(newRecord);
    }, 500); // Simulate network delay
  });
};

// Update a health record (for doctor's responses)
export const updateHealthRecord = (recordId: string, updates: Partial<HealthRecord>): Promise<HealthRecord> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const recordIndex = healthRecords.findIndex(r => r.id === recordId);
      
      if (recordIndex === -1) {
        reject(new Error('Record not found'));
        return;
      }
      
      const updatedRecord = {
        ...healthRecords[recordIndex],
        ...updates,
        status: 'responded' as const
      };
      
      healthRecords = [
        ...healthRecords.slice(0, recordIndex),
        updatedRecord,
        ...healthRecords.slice(recordIndex + 1)
      ];
      
      resolve(updatedRecord);
    }, 500); // Simulate network delay
  });
};
