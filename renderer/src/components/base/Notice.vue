<script lang="ts" setup>
import { ref } from "vue";

defineProps({
  type: String,
  message: String,
});

const emit = defineEmits(["closeNotice"]);

const snackbar = ref(true);

const onBtnClose = () => {
  snackbar.value = false;
  emit("closeNotice");
};
</script>

<template>
  <v-snackbar v-model="snackbar" :timeout="type === 'error' ? -1 : 700">
    <p
      class="text-center"
      :class="{
        'text-red': type === 'error',
        'text-green': type === 'success',
      }"
    >
      {{ message }}
    </p>
    <template v-slot:actions v-if="type === 'error'">
      <v-btn color="red" variant="text" @click="onBtnClose"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>
