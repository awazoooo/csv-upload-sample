<template>
  <div class="tabs-container">
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
.tabs-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 5px;
  background: rgba(240, 240, 240, 0.5);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-button {
  padding: 12px 22px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tab-button:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
}

.tab-button.active {
  background: linear-gradient(45deg, #4a6cf7, #6a3ef5);
  color: white;
  box-shadow: 0 4px 8px rgba(74, 108, 247, 0.25);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 3px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 3px 3px 0 0;
}

@media (max-width: 600px) {
  .tabs {
    width: 100%;
  }

  .tab-button {
    flex: 1;
    text-align: center;
    padding: 10px 12px;
    font-size: 0.9rem;
  }
}
</style>
