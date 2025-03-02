<template>
  <div class="home">
    <div class="header">
      <h1>CSV Viewer</h1>
      <p class="subtitle">IIDXスコアデータ分析ツール</p>
    </div>

    <CsvUploader @data-processed="handleDataProcessed" />

    <div class="data-section" v-if="hasData">
      <TabSelector v-model="currentTab" :tabs="Object.keys(candidates)" />

      <div class="content">
        <div v-if="currentTabData.length === 0" class="no-data">
          <p>データがありません。</p>
        </div>
        <div v-else class="cards-container">
          <MusicDataCard v-for="(item, index) in currentTabData" :key="index" :data="item" />
        </div>
      </div>
    </div>

    <div v-else class="content empty-state">
      <div class="empty-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      </div>
      <p>CSVをアップロードしてデータを表示</p>
      <p class="empty-hint">
        スコアデータをアップロードすると、レーダー値ごとの最適な曲が表示されます
      </p>
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

.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

h1 {
  color: #333;
  margin-bottom: 8px;
  font-size: 2.2rem;
  background: linear-gradient(45deg, #4a6cf7, #6a3ef5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.data-section {
  animation: fadeIn 0.5s ease-out;
}

.content {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
  transition: all 0.3s ease;
}

.content:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  color: #4a6cf7;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-hint {
  font-size: 0.9rem;
  color: #999;
  max-width: 400px;
  margin: 10px auto 0;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
