<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, ref } from 'vue';
import ActionMenu from '@/components/ActionMenu.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/types/appointment';

const props = defineProps<{
  appointments: Appointment[];
}>();

defineEmits<{
  edit: [appointment: Appointment];
  remove: [id: string];
}>();

const hourSlots = Array.from({ length: 10 }, (_, index) => index + 8);
const weekStart = ref(getStartOfWeek(new Date()));

const weekDays = computed(() =>
  Array.from({ length: 6 }, (_, index) => {
    const date = new Date(weekStart.value);
    date.setDate(weekStart.value.getDate() + index);

    return {
      date,
      key: toDateKey(date),
      label: formatWeekday(date),
    };
  }),
);

const weekRangeLabel = computed(() => {
  const start = weekDays.value[0].date;
  const end = weekDays.value[weekDays.value.length - 1].date;
  const sameMonth = start.getMonth() === end.getMonth();
  const startMonth = start.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const endMonth = end.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');

  if (sameMonth) {
    return `${start.getDate()} - ${end.getDate()} ${endMonth}`;
  }

  return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth}`;
});

function getStartOfWeek(date: Date) {
  const nextDate = new Date(date);
  const day = nextDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  nextDate.setDate(nextDate.getDate() + diff);
  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatWeekday(date: Date) {
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  return `${capitalize(weekday)} ${date.getDate()}`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function changeWeek(direction: -1 | 1) {
  const nextDate = new Date(weekStart.value);
  nextDate.setDate(nextDate.getDate() + direction * 7);
  weekStart.value = nextDate;
}

function getAppointmentsForSlot(date: string, hour: number) {
  return props.appointments.filter((appointment) => appointment.date === date && Number(appointment.time.slice(0, 2)) === hour);
}

function getEventColor(procedure: string) {
  const normalizedProcedure = procedure.toLowerCase();

  if (normalizedProcedure.includes('limpeza')) {
    return 'border-pink-500 bg-pink-100 text-pink-700';
  }

  if (normalizedProcedure.includes('drenagem')) {
    return 'border-rose-500 bg-rose-100 text-rose-700';
  }

  if (normalizedProcedure.includes('botox') || normalizedProcedure.includes('avalia')) {
    return 'border-fuchsia-500 bg-fuchsia-100 text-fuchsia-700';
  }

  if (normalizedProcedure.includes('peeling')) {
    return 'border-pink-400 bg-pink-50 text-pink-800';
  }

  if (normalizedProcedure.includes('micro')) {
    return 'border-purple-400 bg-purple-100 text-purple-700';
  }

  if (normalizedProcedure.includes('preenchimento')) {
    return 'border-fuchsia-500 bg-fuchsia-100 text-fuchsia-700';
  }

  return 'border-rose-500 bg-rose-100 text-rose-700';
}
</script>

<template>
  <Card class="overflow-hidden rounded-[18px]">
    <CardContent class="p-0">
      <div class="flex flex-col gap-4 p-4 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-3">
            <Button type="button" variant="outline" size="icon" @click="changeWeek(-1)">
              <ChevronLeft />
            </Button>
            <h3 class="min-w-48 text-lg font-bold text-foreground">{{ weekRangeLabel }}</h3>
            <Button type="button" variant="outline" size="icon" @click="changeWeek(1)">
              <ChevronRight />
            </Button>
          </div>

          <div class="inline-flex w-fit rounded-lg bg-muted p-1 text-sm">
            <button type="button" class="rounded-md px-4 py-1.5 text-muted-foreground">Dia</button>
            <button type="button" class="rounded-md bg-card px-4 py-1.5 font-semibold text-pink-600 shadow-sm">Semana</button>
            <button type="button" class="rounded-md px-4 py-1.5 text-muted-foreground">Mês</button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <div class="min-w-[840px] overflow-hidden rounded-md border border-border">
            <div class="grid grid-cols-[60px_repeat(6,minmax(120px,1fr))] border-b border-border bg-muted/35">
              <div class="h-10 border-r border-border" />
              <div
                v-for="day in weekDays"
                :key="day.key"
                class="flex h-10 items-center justify-center border-r border-border text-sm font-semibold text-foreground last:border-r-0"
              >
                {{ day.label }}
              </div>
            </div>

            <div
              v-for="hour in hourSlots"
              :key="hour"
              class="grid min-h-16 grid-cols-[60px_repeat(6,minmax(120px,1fr))] border-b border-border last:border-b-0"
            >
              <div class="border-r border-border px-2 pt-3 text-right text-xs text-slate-400">
                {{ String(hour).padStart(2, '0') }}:00
              </div>

              <div
                v-for="day in weekDays"
                :key="`${day.key}-${hour}`"
                class="relative min-h-16 border-r border-border p-1 last:border-r-0"
              >
                <article
                  v-for="appointment in getAppointmentsForSlot(day.key, hour)"
                  :key="appointment.id"
                  :class="
                    cn(
                      'group relative mb-1 min-h-14 overflow-hidden rounded border-l-4 px-2 py-1.5 text-xs shadow-sm',
                      getEventColor(appointment.procedure),
                    )
                  "
                >
                  <p class="truncate font-bold">{{ appointment.procedure }}</p>
                  <p class="truncate">{{ appointment.patientName }}</p>
                  <p class="truncate text-[11px] opacity-80">{{ appointment.time }} · {{ appointment.professional }}</p>
                  <div class="absolute right-1 top-1 hidden group-hover:block">
                    <ActionMenu @edit="$emit('edit', appointment)" @remove="$emit('remove', appointment.id)" />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
