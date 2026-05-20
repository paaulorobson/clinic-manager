<script setup lang="ts">
import { Search } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Appointment } from '@/types/appointment';
import type { Patient } from '@/types/patient';
import PatientListItem from './PatientListItem.vue';

const props = defineProps<{
  appointments: Appointment[];
  patients: Patient[];
}>();

defineEmits<{
  edit: [patient: Patient];
  remove: [id: string];
}>();

const search = ref('');

const filteredPatients = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) {
    return props.patients;
  }

  return props.patients.filter((patient) => {
    const searchableContent = [patient.name, patient.whatsapp, patient.email].filter(Boolean).join(' ').toLowerCase();
    return searchableContent.includes(query);
  });
});

function handleSearch(event: Event) {
  const input = event.target as HTMLInputElement;
  search.value = input.value;
}
</script>

<template>
  <Card class="rounded-[18px]">
    <CardContent class="p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full sm:max-w-80">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input :value="search" type="search" placeholder="Buscar paciente..." class="h-10 pl-10" @input="handleSearch" />
        </div>

        <p class="text-sm font-medium text-muted-foreground">
          {{ patients.length }} {{ patients.length === 1 ? 'paciente' : 'pacientes' }}
        </p>
      </div>

      <div class="mt-6 overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse">
          <thead>
            <tr class="border-b border-border text-left text-sm font-semibold text-slate-400">
              <th class="pb-3 pr-4">Paciente</th>
              <th class="px-4 pb-3">Contato</th>
              <th class="px-4 pb-3">Última Visita</th>
              <th class="px-4 pb-3">Status</th>
              <th class="pb-3 pl-4" />
            </tr>
          </thead>

          <tbody v-if="filteredPatients.length">
            <PatientListItem
              v-for="patient in filteredPatients"
              :key="patient.id"
              :appointments="appointments"
              :patient="patient"
              @edit="$emit('edit', $event)"
              @remove="$emit('remove', $event)"
            />
          </tbody>
        </table>

        <div v-if="!filteredPatients.length" class="py-12 text-center">
          <p class="text-base font-medium text-foreground">Nenhum paciente encontrado.</p>
          <p class="mt-1 text-sm text-muted-foreground">Tente buscar por nome, WhatsApp ou e-mail.</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
