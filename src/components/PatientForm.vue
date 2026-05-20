<script setup lang="ts">
import { RotateCcw, UserPlus } from '@lucide/vue';
import { computed, reactive, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Patient, PatientForm, PatientFormErrors } from '@/types/patient';
import { formatWhatsapp } from '@/utils/whatsapp';

const props = defineProps<{
  patient?: Patient | null;
}>();

const emit = defineEmits<{
  submit: [form: PatientForm];
}>();

const form = reactive<PatientForm>({
  name: '',
  whatsapp: '',
  email: '',
  birthDate: '',
});

const submitted = ref(false);
const today = new Date().toISOString().slice(0, 10);

const cleanWhatsapp = computed(() => form.whatsapp.replace(/\D/g, ''));

const errors = computed<PatientFormErrors>(() => {
  const currentErrors: PatientFormErrors = {};

  if (!form.name.trim()) {
    currentErrors.name = 'Informe o nome do paciente.';
  }

  if (cleanWhatsapp.value.length < 10 || cleanWhatsapp.value.length > 11) {
    currentErrors.whatsapp = 'Informe um WhatsApp com DDD.';
  }

  if (!form.birthDate) {
    currentErrors.birthDate = 'Informe a data de nascimento.';
  } else if (form.birthDate > today) {
    currentErrors.birthDate = 'A data não pode ser futura.';
  }

  return currentErrors;
});

const hasErrors = computed(() => Object.keys(errors.value).length > 0);
const isEditing = computed(() => Boolean(props.patient));

watch(
  () => props.patient,
  (patient) => {
    if (!patient) {
      resetForm();
      return;
    }

    form.name = patient.name;
    form.whatsapp = patient.whatsapp;
    form.email = patient.email ?? '';
    form.birthDate = patient.birthDate;
    submitted.value = false;
  },
  { immediate: true },
);

function handleWhatsappInput(event: Event) {
  const input = event.target as HTMLInputElement;
  form.whatsapp = formatWhatsapp(input.value);
}

function handleEmailInput(event: Event) {
  const input = event.target as HTMLInputElement;
  form.email = input.value;
}

function handleNameInput(event: Event) {
  const input = event.target as HTMLInputElement;
  form.name = input.value;
}

function handleBirthDateInput(event: Event) {
  const input = event.target as HTMLInputElement;
  form.birthDate = input.value;
}

function resetForm() {
  form.name = '';
  form.whatsapp = '';
  form.email = '';
  form.birthDate = '';
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
      <CardTitle>{{ isEditing ? 'Editar paciente' : 'Novo paciente' }}</CardTitle>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="patient-name">Nome</Label>
            <Input
              id="patient-name"
              :value="form.name"
              type="text"
              autocomplete="name"
              :class="{ 'border-destructive focus-visible:ring-destructive': submitted && errors.name }"
              @input="handleNameInput"
            />
            <span v-if="submitted && errors.name" class="block text-sm text-destructive">{{ errors.name }}</span>
          </div>

          <div class="space-y-2">
            <Label for="patient-whatsapp">WhatsApp</Label>
            <Input
              id="patient-whatsapp"
              :value="form.whatsapp"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              placeholder="(85) 99999-9999"
              :class="{ 'border-destructive focus-visible:ring-destructive': submitted && errors.whatsapp }"
              @input="handleWhatsappInput"
            />
            <span v-if="submitted && errors.whatsapp" class="block text-sm text-destructive">{{ errors.whatsapp }}</span>
          </div>

          <div class="space-y-2">
            <Label for="patient-email">E-mail</Label>
            <Input
              id="patient-email"
              :value="form.email"
              type="email"
              autocomplete="email"
              placeholder="paciente@email.com"
              @input="handleEmailInput"
            />
          </div>

          <div class="space-y-2">
            <Label for="patient-birth-date">Data de nascimento</Label>
            <Input
              id="patient-birth-date"
              :value="form.birthDate"
              type="date"
              :max="today"
              :class="{ 'border-destructive focus-visible:ring-destructive': submitted && errors.birthDate }"
              @input="handleBirthDateInput"
            />
            <span v-if="submitted && errors.birthDate" class="block text-sm text-destructive">{{ errors.birthDate }}</span>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <Button type="submit" size="lg" class="flex-1">
            <UserPlus />
            {{ isEditing ? 'Salvar' : 'Cadastrar' }}
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
