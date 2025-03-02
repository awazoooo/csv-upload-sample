<template>
  <div class="home">
    <h1>CSV Viewer</h1>

    <CsvUploader @data-processed="handleDataProcessed" />

    <TabSelector v-if="hasData" v-model="currentTab" :tabs="Object.keys(candidates)" />

    <div class="content" v-if="hasData">
      <div v-if="currentTabData.length === 0" class="no-data">
        <p>データがありません。</p>
      </div>
      <div v-else class="cards-container">
        <MusicDataCard v-for="(item, index) in currentTabData" :key="index" :data="item" />
      </div>
    </div>

    <div v-else class="content empty-state">
      <p>CSVをアップロードしてください。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CsvUploader from '@/components/CsvUploader.vue'
import TabSelector from '@/components/TabSelector.vue'
import MusicDataCard from '@/components/MusicDataCard.vue'
import type { CandidatesData } from '@/types'

// データの状態
const candidates = ref<CandidatesData>({
  NOTES: [],
  CHORD: [],
  PEAK: [],
  CHARGE: [],
  SCRATCH: [],
  'SOF-RAN': [],
})

// 現在選択されているタブ
const currentTab = ref('NOTES')

// データが存在するかどうか
const hasData = computed(() => {
  return Object.values(candidates.value).some((arr) => arr.length > 0)
})

// 現在のタブのデータ
const currentTabData = computed(() => {
  return candidates.value[currentTab.value as keyof CandidatesData]
})

// CSVデータが処理されたときのハンドラ
const handleDataProcessed = (data: CandidatesData) => {
  candidates.value = data
}
</script>

<style scoped>
.home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.content {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
}

.no-data {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
