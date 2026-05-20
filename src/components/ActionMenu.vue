<script setup lang="ts">
import { Edit3, MoreVertical, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';

defineEmits<{
  edit: [];
  remove: [];
}>();

const isOpen = ref(false);

function closeMenu() {
  isOpen.value = false;
}
</script>

<template>
  <div class="relative inline-flex">
    <Button type="button" variant="ghost" size="icon" class="text-muted-foreground" @click="isOpen = !isOpen">
      <MoreVertical />
    </Button>

    <div
      v-if="isOpen"
      class="absolute right-0 top-10 z-20 min-w-36 overflow-hidden rounded-md border border-border bg-card py-1 text-sm shadow-lg"
    >
      <button
        type="button"
        class="flex w-full items-center gap-2 px-3 py-2 text-left text-foreground hover:bg-accent hover:text-accent-foreground"
        @click="
          $emit('edit');
          closeMenu();
        "
      >
        <Edit3 class="size-4" />
        Editar
      </button>

      <button
        type="button"
        class="flex w-full items-center gap-2 px-3 py-2 text-left text-destructive hover:bg-destructive/10"
        @click="
          $emit('remove');
          closeMenu();
        "
      >
        <Trash2 class="size-4" />
        Excluir
      </button>
    </div>
  </div>
</template>
