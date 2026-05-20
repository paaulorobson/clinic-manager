export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  professional: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
};

export type AppointmentForm = {
  patientId: string;
  procedure: string;
  professional: string;
  date: string;
  time: string;
  notes: string;
};

export type AppointmentFormErrors = Partial<Record<keyof AppointmentForm, string>>;
