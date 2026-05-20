<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { ref } from 'vue';
import PatientForm from '@/components/PatientForm.vue';
import PatientList from '@/components/PatientList.vue';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/composables/useAppointments';
import { usePatients } from '@/composables/usePatients';
import type { Patient, PatientForm as PatientFormPayload } from '@/types/patient';

const { addPatient, removePatient, sortedPatients, updatePatient } = usePatients();
const { sortedAppointments } = useAppointments();
const showForm = ref(false);
const editingPatient = ref<Patient | null>(null);

function openNewPatientForm() {
  editingPatient.value = null;
  showForm.value = true;
}

function editPatient(patient: Patient) {
  editingPatient.value = patient;
  showForm.value = true;
}

function handleSubmitPatient(form: PatientFormPayload) {
  if (editingPatient.value) {
    updatePatient(editingPatient.value.id, form);
  } else {
    addPatient(form);
  }

  editingPatient.value = null;
  showForm.value = false;
}
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-normal text-foreground">Pacientes</h2>
        <p class="mt-1 text-base text-muted-foreground">Gerencie o cadastro e histórico de seus pacientes</p>
      </div>

      <Button type="button" size="lg" class="px-5 shadow-md" @click="openNewPatientForm">
        <Plus />
        Novo Paciente
      </Button>
    </div>

    <div v-if="showForm" class="grid gap-6 lg:grid-cols-[380px_1fr]">
      <PatientForm :patient="editingPatient" @submit="handleSubmitPatient" />
      <PatientList :appointments="sortedAppointments" :patients="sortedPatients" @edit="editPatient" @remove="removePatient" />
    </div>

    <PatientList v-else :appointments="sortedAppointments" :patients="sortedPatients" @edit="editPatient" @remove="removePatient" />
  </section>
</template>
