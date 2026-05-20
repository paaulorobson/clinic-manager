import { createRouter, createWebHistory } from 'vue-router';
import Appointments from '@/pages/Appointments.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Patients from '@/pages/Patients.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/pacientes',
      name: 'patients',
      component: Patients,
    },
    {
      path: '/agendamentos',
      name: 'appointments',
      component: Appointments,
    },
  ],
});
