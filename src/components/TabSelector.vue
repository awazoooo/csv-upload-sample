<template>
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="tab-button"
      :class="{ active: modelValue === tab }"
      @click="$emit('update:modelValue', tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: string[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
  gap: 8px;
}

.tab-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #f0f0f0;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #e0e0e0;
}

.tab-button.active {
  background: #4a6cf7;
  color: white;
}
</style>
