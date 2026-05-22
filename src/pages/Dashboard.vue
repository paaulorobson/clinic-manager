<script setup lang="ts">
import { CalendarCheck, Clock3, Gift, PartyPopper, Plus } from '@lucide/vue';
import { computed, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import ActionMenu from '@/components/ActionMenu.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppointments } from '@/composables/useAppointments';
import { usePatients } from '@/composables/usePatients';
import type { Appointment } from '@/types/appointment';
import type { PatientForm } from '@/types/patient';
import { formatBirthDate } from '@/utils/date';
import { formatWhatsapp } from '@/utils/whatsapp';

const { addPatient, sortedPatients } = usePatients();
const { removeAppointment, sortedAppointments } = useAppointments();

const quickForm = reactive<PatientForm>({
  name: '',
  whatsapp: '',
  email: '',
  birthDate: '',
});

const today = new Date().toISOString().slice(0, 10);

const todaysAppointments = computed(() => sortedAppointments.value.filter((appointment) => appointment.date === today));

const nextHourAppointments = computed(() => {
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

  return sortedAppointments.value
    .filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      return appointmentDate >= now && appointmentDate <= nextHour;
    })
    .slice(0, 2);
});

const birthdayPatients = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  return sortedPatients.value
    .filter((patient) => {
      const [, month, day] = patient.birthDate.split('-').map(Number);
      return month === currentMonth && day === currentDay;
    })
    .slice(0, 3);
});

const agendaPreview = computed(() => sortedAppointments.value.slice(0, 3));

function handleQuickWhatsappInput(event: Event) {
  const input = event.target as HTMLInputElement;
  quickForm.whatsapp = formatWhatsapp(input.value);
}

function setQuickField(field: keyof PatientForm, event: Event) {
  const input = event.target as HTMLInputElement;
  quickForm[field] = input.value;
}

function resetQuickForm() {
  quickForm.name = '';
  quickForm.whatsapp = '';
  quickForm.email = '';
  quickForm.birthDate = '';
}

function saveQuickPatient() {
  const whatsappDigits = quickForm.whatsapp.replace(/\D/g, '');

  if (!quickForm.name.trim() || whatsappDigits.length < 10 || !quickForm.birthDate) {
    return;
  }

  addPatient({ ...quickForm });
  resetQuickForm();
}

function appointmentStatus(appointment: Appointment) {
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const now = new Date();

  if (appointmentDate < now) {
    return {
      label: 'FINALIZADO',
      className: 'bg-slate-100 text-slate-600',
    };
  }

  if (appointment.date === today) {
    return {
      label: 'CONFIRMADO',
      className: 'bg-amber-100 text-amber-800',
    };
  }

  return {
    label: 'AGUARDANDO',
    className: 'bg-yellow-100 text-yellow-800',
  };
}
</script>

<template>
  <section class="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-3 lg:px-8">
    <Card class="overflow-hidden border-0 bg-gradient-to-br from-amber-600 to-yellow-400 text-white shadow-md">
      <CardContent class="relative p-6">
        <Gift class="absolute right-7 top-7 size-9 text-white/25" />
        <h2 class="max-w-52 text-xl font-bold leading-snug">Aniversariantes de Hoje</h2>
        <p class="mt-1 text-sm text-white/90">Fortaleça o relacionamento!</p>

        <div class="mt-5 space-y-2 text-sm">
          <div v-if="birthdayPatients.length" v-for="patient in birthdayPatients" :key="patient.id" class="flex items-center gap-2">
            <PartyPopper class="size-4" />
            <span>{{ patient.name }}</span>
          </div>
          <p v-else class="text-white/85">Nenhum aniversariante hoje.</p>
        </div>

        <Button type="button" variant="secondary" class="mt-5 text-amber-800 hover:text-amber-900">
          Enviar Parabéns (WhatsApp)
        </Button>
      </CardContent>
    </Card>

    <Card class="shadow-sm">
      <CardContent class="p-6">
        <div class="flex items-center gap-2">
          <Clock3 class="size-4 text-amber-600" />
          <h2 class="text-lg font-bold">Próximos em 1 Hora</h2>
        </div>

        <div class="mt-5 space-y-4">
          <div
            v-for="appointment in nextHourAppointments"
            :key="appointment.id"
            class="border-l-4 border-amber-500 pl-3"
          >
            <p class="font-bold">{{ appointment.procedure }}</p>
            <p class="text-sm text-muted-foreground">Paciente: {{ appointment.patientName }} • {{ appointment.time }}</p>
          </div>
          <p v-if="!nextHourAppointments.length" class="text-sm text-muted-foreground">Nenhum procedimento na próxima hora.</p>
        </div>
      </CardContent>
    </Card>

    <Card class="shadow-sm">
      <CardContent class="flex h-full items-center justify-between p-6">
        <div>
          <p class="text-sm text-muted-foreground">Agendamentos Hoje</p>
          <p class="mt-1 text-4xl font-bold leading-none">{{ todaysAppointments.length }}</p>
          <p class="mt-2 text-sm text-amber-700">↑ +15% que ontem</p>
        </div>
        <div class="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <CalendarCheck class="size-6" />
        </div>
      </CardContent>
    </Card>

    <Card class="shadow-sm lg:col-span-1">
      <CardContent class="p-6">
        <h2 class="text-lg font-bold">Rápido Cadastro de Paciente</h2>

        <form class="mt-6 space-y-4" @submit.prevent="saveQuickPatient">
          <div class="space-y-2">
            <Label for="quick-name">Nome Completo</Label>
            <Input id="quick-name" :value="quickForm.name" @input="setQuickField('name', $event)" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="quick-whatsapp">WhatsApp</Label>
              <Input
                id="quick-whatsapp"
                :value="quickForm.whatsapp"
                type="tel"
                inputmode="numeric"
                placeholder="(11) 99999-9999"
                @input="handleQuickWhatsappInput"
              />
            </div>

            <div class="space-y-2">
              <Label for="quick-birth-date">Data Nasc.</Label>
              <Input
                id="quick-birth-date"
                :value="quickForm.birthDate"
                type="date"
                @input="setQuickField('birthDate', $event)"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="quick-email">E-mail</Label>
            <Input id="quick-email" :value="quickForm.email" type="email" @input="setQuickField('email', $event)" />
          </div>

          <Button type="submit" size="lg" class="w-full">
            Salvar Paciente
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card class="shadow-sm lg:col-span-2">
      <CardContent class="p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-bold">Agenda de Procedimentos</h2>
          <div class="flex gap-2">
            <Button as="RouterLink" to="/agendamentos" variant="secondary" size="sm">Hoje</Button>
            <Button as="RouterLink" to="/agendamentos" size="sm">
              <Plus />
              Novo Agendamento
            </Button>
          </div>
        </div>

        <div class="mt-6 overflow-x-auto">
          <table class="w-full min-w-[620px] border-collapse">
            <thead>
              <tr class="border-b border-border text-left text-sm font-semibold text-slate-400">
                <th class="pb-3 pr-4">Procedimento</th>
                <th class="px-4 pb-3">Paciente</th>
                <th class="px-4 pb-3">Responsável</th>
                <th class="px-4 pb-3">Status</th>
                <th class="pb-3 pl-4 text-right">Ação</th>
              </tr>
            </thead>

            <tbody v-if="agendaPreview.length">
              <tr v-for="appointment in agendaPreview" :key="appointment.id" class="border-b border-border last:border-b-0">
                <td class="py-4 pr-4 font-semibold">{{ appointment.procedure }}</td>
                <td class="px-4 py-4">{{ appointment.patientName }}</td>
                <td class="px-4 py-4">{{ appointment.professional }}</td>
                <td class="px-4 py-4">
                  <span :class="['rounded-md px-2 py-1 text-xs font-bold', appointmentStatus(appointment).className]">
                    {{ appointmentStatus(appointment).label }}
                  </span>
                </td>
                <td class="py-4 pl-4 text-right">
                  <ActionMenu
                    @edit="$router.push({ path: '/agendamentos', query: { edit: appointment.id } })"
                    @remove="removeAppointment(appointment.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!agendaPreview.length" class="py-10 text-center text-sm text-muted-foreground">
            Nenhum procedimento na agenda.
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
