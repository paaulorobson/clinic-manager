<script setup lang="ts">
import { Mail, Phone } from '@lucide/vue';
import ActionMenu from '@/components/ActionMenu.vue';
import { Badge } from '@/components/ui/badge';
import type { Appointment } from '@/types/appointment';
import type { Patient } from '@/types/patient';
import { formatBirthDate } from '@/utils/date';

const props = defineProps<{
  appointments: Appointment[];
  patient: Patient;
}>();

defineEmits<{
  edit: [patient: Patient];
  remove: [id: string];
}>();

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function getLastVisit() {
  const today = new Date().toISOString().slice(0, 10);
  const pastAppointments = props.appointments
    .filter((appointment) => appointment.patientId === props.patient.id && appointment.date <= today)
    .sort((first, second) => second.date.localeCompare(first.date));

  return pastAppointments[0]?.date;
}

function isActive() {
  const lastVisit = getLastVisit();

  if (!lastVisit) {
    return true;
  }

  const visitDate = new Date(`${lastVisit}T00:00:00`);
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - 90);

  return visitDate >= limitDate;
}
</script>

<template>
  <tr class="border-b border-border last:border-b-0">
    <td class="py-4 pr-4">
      <div class="flex min-w-0 items-center gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
          {{ getInitials(patient.name) }}
        </div>
        <span class="truncate font-semibold text-foreground">{{ patient.name }}</span>
      </div>
    </td>

    <td class="px-4 py-4">
      <div class="space-y-1 text-sm text-slate-700">
        <div class="flex items-center gap-2">
          <Phone class="size-3.5 text-amber-500" />
          <span>{{ patient.whatsapp }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Mail class="size-3.5 text-amber-500" />
          <span>{{ patient.email || 'E-mail não informado' }}</span>
        </div>
      </div>
    </td>

    <td class="px-4 py-4 text-sm font-medium text-slate-700">
      {{ getLastVisit() ? formatBirthDate(getLastVisit() as string) : '-' }}
    </td>

    <td class="px-4 py-4">
      <Badge
        variant="secondary"
        :class="isActive() ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'"
      >
        {{ isActive() ? 'ATIVO' : 'INATIVO' }}
      </Badge>
    </td>

    <td class="py-4 pl-4 text-right">
      <ActionMenu @edit="$emit('edit', patient)" @remove="$emit('remove', patient.id)" />
    </td>
  </tr>
</template>
