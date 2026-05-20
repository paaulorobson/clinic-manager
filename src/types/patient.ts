export type Patient = {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  birthDate: string;
  createdAt: string;
};

export type PatientForm = {
  name: string;
  whatsapp: string;
  email: string;
  birthDate: string;
};

export type PatientFormErrors = Partial<Record<keyof PatientForm, string>>;
