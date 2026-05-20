<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppointmentCalendar from '@/components/AppointmentCalendar.vue';
import AppointmentForm from '@/components/AppointmentForm.vue';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/composables/useAppointments';
import { usePatients } from '@/composables/usePatients';
import type { Appointment, AppointmentForm as AppointmentFormPayload } from '@/types/appointment';

const { sortedPatients } = usePatients();
const { addAppointment, removeAppointment, sortedAppointments, updateAppointment } = useAppointments();
const showForm = ref(false);
const editingAppointment = ref<Appointment | null>(null);
const route = useRoute();
const router = useRouter();

watch(
  () => route.query.edit,
  (appointmentId) => {
    if (typeof appointmentId !== 'string') {
      return;
    }

    const appointment = sortedAppointments.value.find((currentAppointment) => currentAppointment.id === appointmentId);

    if (appointment) {
      editAppointment(appointment);
    }
  },
  { immediate: true },
);

function openNewAppointmentForm() {
  editingAppointment.value = null;
  showForm.value = true;
  router.replace('/agendamentos');
}

function editAppointment(appointment: Appointment) {
  editingAppointment.value = appointment;
  showForm.value = true;
}

function handleSubmitAppointment(form: AppointmentFormPayload) {
  if (editingAppointment.value) {
    updateAppointment(editingAppointment.value.id, form, sortedPatients.value);
  } else {
    addAppointment(form, sortedPatients.value);
  }

  editingAppointment.value = null;
  showForm.value = false;
  router.replace('/agendamentos');
}
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-normal text-foreground">Agenda Clínica</h2>
        <p class="mt-1 text-base text-muted-foreground">Visualize e gerencie todos os agendamentos</p>
      </div>

      <Button
        type="button"
        size="lg"
        class="px-5 shadow-md"
        @click="openNewAppointmentForm"
      >
        <Plus />
        Novo Agendamento
      </Button>
    </div>

    <div v-if="showForm" class="grid gap-6 lg:grid-cols-[420px_1fr]">
      <AppointmentForm :appointment="editingAppointment" :patients="sortedPatients" @submit="handleSubmitAppointment" />
      <AppointmentCalendar :appointments="sortedAppointments" @edit="editAppointment" @remove="removeAppointment" />
    </div>

    <AppointmentCalendar v-else :appointments="sortedAppointments" @edit="editAppointment" @remove="removeAppointment" />
  </section>
</template>
