<script setup lang="ts">
import { Bell, CalendarDays, LayoutDashboard, Sparkles, Users } from '@lucide/vue';
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pacientes',
    to: '/pacientes',
    icon: Users,
  },
  {
    label: 'Agendamentos',
    to: '/agendamentos',
    icon: CalendarDays,
  },
];

const route = useRoute();

const currentPageTitle = computed(() => {
  const currentItem = navigationItems.find((item) => item.to === route.path);
  return currentItem?.label ?? 'Dashboard';
});
</script>

<template>
  <main class="min-h-screen text-foreground lg:grid lg:grid-cols-[280px_1fr]">
    <aside class="hidden min-h-screen border-r border-border bg-card lg:flex lg:flex-col">
      <div class="flex items-center gap-3 border-b border-border px-6 py-6">
        <div class="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles class="size-5" />
        </div>
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-primary">Clínica de estética</p>
          <h1 class="text-2xl font-bold tracking-normal text-foreground">Gestão clínica</h1>
        </div>
      </div>

      <nav class="flex flex-1 flex-col gap-2 px-4 py-5">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          v-slot="{ isActive, navigate, href }"
          custom
        >
          <a
            :href="href"
            :class="
              cn(
                'inline-flex h-11 items-center gap-3 rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'text-muted-foreground',
              )
            "
            @click="navigate"
          >
            <component :is="item.icon" class="size-4" />
            {{ item.label }}
          </a>
        </RouterLink>
      </nav>
    </aside>

    <section class="min-w-0">
      <header class="border-b border-border bg-card lg:hidden">
        <div class="flex flex-col gap-4 px-4 py-4 sm:px-6">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles class="size-5" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-primary">Clínica de estética</p>
              <h1 class="text-xl font-bold tracking-normal text-foreground">Gestão clínica</h1>
            </div>
          </div>

          <nav class="flex flex-wrap gap-2">
            <RouterLink
              v-for="item in navigationItems"
              :key="item.to"
              :to="item.to"
              v-slot="{ isActive, navigate, href }"
              custom
            >
              <a
                :href="href"
                :class="
                  cn(
                    'inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'text-muted-foreground',
                  )
                "
                @click="navigate"
              >
                <component :is="item.icon" class="size-4" />
                {{ item.label }}
              </a>
            </RouterLink>
          </nav>
        </div>
      </header>

      <div class="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary lg:hidden">Clínica de estética</p>
            <h2 class="text-lg font-bold text-foreground">{{ currentPageTitle }}</h2>
          </div>

          <div class="flex items-center gap-3">
            <Button type="button" variant="outline" size="icon" title="Notificações em breve" aria-label="Notificações em breve">
              <Bell />
            </Button>

            <div class="flex items-center gap-3 rounded-md border border-border bg-card px-2 py-1.5">
              <div class="flex size-9 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                AC
              </div>
              <div class="hidden text-sm sm:block">
                <p class="font-semibold leading-none text-foreground">Admin Clínica</p>
                <p class="mt-1 text-xs text-muted-foreground">Estética</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RouterView />
    </section>
  </main>
</template>
