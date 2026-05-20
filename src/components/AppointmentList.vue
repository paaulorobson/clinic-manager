<script setup lang="ts">
import { CalendarX } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Appointment } from '@/types/appointment';
import { formatBirthDate } from '@/utils/date';

defineProps<{
  appointments: Appointment[];
}>();

defineEmits<{
  remove: [id: string];
}>();
</script>

<template>
  <Card>
    <CardHeader class="border-b border-border">
      <CardTitle>Agenda</CardTitle>
    </CardHeader>

    <div v-if="appointments.length" class="divide-y divide-border">
      <article
        v-for="appointment in appointments"
        :key="appointment.id"
        class="grid gap-3 px-5 py-4 xl:grid-cols-[1fr_auto] xl:items-center"
      >
        <div class="min-w-0">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 class="truncate text-base font-semibold text-foreground">{{ appointment.patientName }}</h3>
            <p class="text-sm font-medium text-primary">
              {{ formatBirthDate(appointment.date) }} às {{ appointment.time }}
            </p>
          </div>

          <dl class="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <dt class="font-medium">Procedimento</dt>
              <dd class="text-foreground">{{ appointment.procedure }}</dd>
            </div>
            <div>
              <dt class="font-medium">Profissional</dt>
              <dd class="text-foreground">{{ appointment.professional }}</dd>
            </div>
          </dl>

          <p v-if="appointment.notes" class="mt-3 text-sm text-muted-foreground">
            {{ appointment.notes }}
          </p>
        </div>

        <Button type="button" variant="destructive" size="sm" @click="$emit('remove', appointment.id)">
          <CalendarX />
          Cancelar
        </Button>
      </article>
    </div>

    <CardContent v-else class="py-12 text-center">
      <p class="text-base font-medium text-foreground">Nenhum procedimento agendado.</p>
      <p class="mt-1 text-sm text-muted-foreground">Os agendamentos da clínica aparecem aqui em ordem de data.</p>
    </CardContent>
  </Card>
</template>
