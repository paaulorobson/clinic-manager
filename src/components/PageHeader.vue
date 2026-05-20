<script setup lang="ts">
import { Badge } from '@/components/ui/badge';

defineProps<{
  eyebrow: string;
  title: string;
  count: number;
  singularLabel: string;
  pluralLabel: string;
}>();
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-6 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
    <div>
      <p class="text-sm font-semibold uppercase tracking-wide text-primary">{{ eyebrow }}</p>
      <h2 class="mt-1 text-3xl font-bold tracking-normal text-foreground">{{ title }}</h2>
    </div>

    <Badge variant="secondary" class="px-4 py-3 text-sm">
      <span class="font-semibold">{{ count }}</span>
      {{ count === 1 ? singularLabel : pluralLabel }}
    </Badge>
  </section>
</template>
