import { computed, ref, watch } from 'vue';
import type { Patient, PatientForm } from '@/types/patient';
import { formatWhatsapp } from '@/utils/whatsapp';

const storageKey = 'clinica:patients';

export function usePatients() {
  const patients = ref<Patient[]>(loadPatients());

  const sortedPatients = computed(() =>
    [...patients.value].sort((first, second) => first.name.localeCompare(second.name, 'pt-BR')),
  );

  const totalPatients = computed(() => patients.value.length);

  watch(
    patients,
    (value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    { deep: true },
  );

  function addPatient(form: PatientForm) {
    patients.value.push({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      whatsapp: formatWhatsapp(form.whatsapp),
      email: form.email.trim(),
      birthDate: form.birthDate,
      createdAt: new Date().toISOString(),
    });
  }

  function removePatient(id: string) {
    patients.value = patients.value.filter((patient) => patient.id !== id);
  }

  function updatePatient(id: string, form: PatientForm) {
    patients.value = patients.value.map((patient) => {
      if (patient.id !== id) {
        return patient;
      }

      return {
        ...patient,
        name: form.name.trim(),
        whatsapp: formatWhatsapp(form.whatsapp),
        email: form.email.trim(),
        birthDate: form.birthDate,
      };
    });
  }

  return {
    addPatient,
    patients,
    removePatient,
    sortedPatients,
    totalPatients,
    updatePatient,
  };
}

function loadPatients(): Patient[] {
  const savedPatients = localStorage.getItem(storageKey);

  if (!savedPatients) {
    return [];
  }

  try {
    return JSON.parse(savedPatients) as Patient[];
  } catch {
    return [];
  }
}
