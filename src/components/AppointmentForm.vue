<script setup lang="ts">
import { CalendarPlus, RotateCcw } from '@lucide/vue';
import { computed, reactive, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Appointment, AppointmentForm, AppointmentFormErrors } from '@/types/appointment';
import type { Patient } from '@/types/patient';

const props = defineProps<{
  appointment?: Appointment | null;
  patients: Patient[];
}>();

const emit = defineEmits<{
  submit: [form: AppointmentForm];
}>();

const procedureOptions = [
  'Limpeza de pele',
  'Peeling químico',
  'Microagulhamento',
  'Botox',
  'Preenchimento facial',
  'Drenagem linfática',
  'Depilação a laser',
  'Avaliação estética',
];

const form = reactive<AppointmentForm>({
  patientId: '',
  procedure: '',
  professional: '',
  date: '',
  time: '',
  notes: '',
});

const submitted = ref(false);
const today = new Date().toISOString().slice(0, 10);

const errors = computed<AppointmentFormErrors>(() => {
  const currentErrors: AppointmentFormErrors = {};

  if (!form.patientId) {
    currentErrors.patientId = 'Selecione uma paciente.';
  }

  if (!form.procedure) {
    currentErrors.procedure = 'Selecione o procedimento.';
  }

  if (!form.professional.trim()) {
    currentErrors.professional = 'Informe o profissional.';
  }

  if (!form.date) {
    currentErrors.date = 'Informe a data.';
  } else if (form.date < today) {
    currentErrors.date = 'A data não pode ser anterior a hoje.';
  }

  if (!form.time) {
    currentErrors.time = 'Informe o horário.';
  }

  return currentErrors;
});

const hasErrors = computed(() => Object.keys(errors.value).length > 0);
const isEditing = computed(() => Boolean(props.appointment));

watch(
  () => props.appointment,
  (appointment) => {
    if (!appointment) {
      resetForm();
      return;
    }

    form.patientId = appointment.patientId;
    form.procedure = appointment.procedure;
    form.professional = appointment.professional;
    form.date = appointment.date;
    form.time = appointment.time;
    form.notes = appointment.notes;
    submitted.value = false;
  },
  { immediate: true },
);

function setField(field: keyof AppointmentForm, event: Event) {
  const input = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  form[field] = input.value;
}

function resetForm() {
  form.patientId = '';
  form.procedure = '';
  form.professional = '';
  form.date = '';
  form.time = '';
  form.notes = '';
  submitted.value = false;
}

function handleSubmit() {
  submitted.value = true;

  if (hasErrors.value) {
    return;
  }

  emit('submit', { ...form });
  resetForm();
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ isEditing ? 'Editar agendamento' : 'Novo agendamento' }}</CardTitle>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="appointment-patient">Paciente</Label>
            <select
              id="appointment-patient"
              :value="form.patientId"
              :disabled="patients.length === 0"
              :class="
                cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  submitted && errors.patientId && 'border-destructive focus-visible:ring-destructive',
                )
              "
              @change="setField('patientId', $event)"
            >
              <option value="">{{ patients.length ? 'Selecione uma paciente' : 'Cadastre uma paciente primeiro' }}</option>
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                {{ patient.name }}
              </option>
            </select>
            <span v-if="submitted && errors.patientId" class="block text-sm text-destructive">{{ errors.patientId }}</span>
          </div>

          <div class="space-y-2">
            <Label for="appointment-procedure">Procedimento</Label>
            <select
              id="appointment-procedure"
              :value="form.procedure"
              :class="
                cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  submitted && errors.procedure && 'border-destructive focus-visible:ring-destructive',
                )
              "
              @change="setField('procedure', $event)"
            >
              <option value="">Selecione o procedimento</option>
              <option v-for="procedure in procedureOptions" :key="procedure" :value="procedure">
                {{ procedure }}
              </option>
            </select>
            <span v-if="submitted && errors.procedure" class="block text-sm text-destructive">{{ errors.procedure }}</span>
          </div>

          <div class="space-y-2">
            <Label for="appointment-professional">Profissional</Label>
            <Input
              id="appointment-professional"
              :value="form.professional"
              type="text"
              placeholder="Ex.: Dra. Marina"
              :class="{ 'border-destructive focus-visible:ring-destructive': submitted && errors.professional }"
              @input="setField('professional', $event)"
            />
            <span v-if="submitted && errors.professional" class="block text-sm text-destructive">{{ errors.professional }}</span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="appointment-date">Data</Label>
              <Input
                id="appointment-date"
                :value="form.date"
                type="date"
                :min="today"
                :class="{ 'border-destructive focus-visible:ring-destructive': submitted && errors.date }"
                @input="setField('date', $event)"
              />
              <span v-if="submitted && errors.date" class="block text-sm text-destructive">{{ errors.date }}</span>
            </div>

            <div class="space-y-2">
              <Label for="appointment-time">Horário</Label>
              <Input
                id="appointment-time"
                :value="form.time"
                type="time"
                :class="{ 'border-destructive focus-visible:ring-destructive': submitted && errors.time }"
                @input="setField('time', $event)"
              />
              <span v-if="submitted && errors.time" class="block text-sm text-destructive">{{ errors.time }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="appointment-notes">Observações</Label>
            <textarea
              id="appointment-notes"
              :value="form.notes"
              rows="3"
              class="flex min-h-20 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Cuidados, preferências ou restrições relevantes"
              @input="setField('notes', $event)"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <Button type="submit" size="lg" class="flex-1" :disabled="patients.length === 0">
            <CalendarPlus />
            {{ isEditing ? 'Salvar' : 'Agendar' }}
          </Button>
          <Button type="button" variant="outline" size="lg" @click="resetForm">
            <RotateCcw />
            Limpar
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
