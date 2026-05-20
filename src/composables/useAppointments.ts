import { computed, ref, watch } from 'vue';
import type { Appointment, AppointmentForm } from '@/types/appointment';
import type { Patient } from '@/types/patient';

const storageKey = 'clinica:appointments';

export function useAppointments() {
  const appointments = ref<Appointment[]>(loadAppointments());

  const sortedAppointments = computed(() =>
    [...appointments.value].sort((first, second) => {
      const firstDate = `${first.date}T${first.time}`;
      const secondDate = `${second.date}T${second.time}`;

      return firstDate.localeCompare(secondDate);
    }),
  );

  const totalAppointments = computed(() => appointments.value.length);

  watch(
    appointments,
    (value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    { deep: true },
  );

  function addAppointment(form: AppointmentForm, patients: Patient[]) {
    const patient = patients.find((currentPatient) => currentPatient.id === form.patientId);

    appointments.value.push({
      id: crypto.randomUUID(),
      patientId: form.patientId,
      patientName: patient?.name ?? 'Paciente não encontrado',
      procedure: form.procedure,
      professional: form.professional.trim(),
      date: form.date,
      time: form.time,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    });
  }

  function removeAppointment(id: string) {
    appointments.value = appointments.value.filter((appointment) => appointment.id !== id);
  }

  function updateAppointment(id: string, form: AppointmentForm, patients: Patient[]) {
    const patient = patients.find((currentPatient) => currentPatient.id === form.patientId);

    appointments.value = appointments.value.map((appointment) => {
      if (appointment.id !== id) {
        return appointment;
      }

      return {
        ...appointment,
        patientId: form.patientId,
        patientName: patient?.name ?? 'Paciente não encontrado',
        procedure: form.procedure,
        professional: form.professional.trim(),
        date: form.date,
        time: form.time,
        notes: form.notes.trim(),
      };
    });
  }

  return {
    addAppointment,
    appointments,
    removeAppointment,
    sortedAppointments,
    totalAppointments,
    updateAppointment,
  };
}

function loadAppointments(): Appointment[] {
  const savedAppointments = localStorage.getItem(storageKey);

  if (!savedAppointments) {
    return [];
  }

  try {
    return JSON.parse(savedAppointments) as Appointment[];
  } catch {
    return [];
  }
}
