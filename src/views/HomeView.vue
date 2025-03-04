<template>
  <div class="home">
    <div class="header">
      <h1>IIDX Notes Radar Viewer</h1>
      <p class="subtitle">IIDX ノーツレーダー値確認ツール</p>
    </div>

    <CsvUploader @data-processed="handleDataProcessed" />

    <div class="data-section" v-if="hasData">
      <TabSelector v-model="currentTab" :tabs="Object.keys(candidates)" />

      <div class="content">
        <div v-if="currentTabData.length === 0" class="no-data">
          <p>データがありません。</p>
        </div>
        <div v-else>
          <!-- 平均レーダー値の表示 -->
          <div class="average-radar-container">
            <div class="average-radar-card">
              <h3>{{ currentTab }} 平均レーダー値</h3>
              <div class="average-value">{{ currentTabAverage }}</div>
              <p class="average-description">
                ※ レーダー値が大きい 10 曲（同一曲名は最大の 1 難易度のみ）の平均値
              </p>
            </div>
          </div>

          <!-- 全曲の表示 -->
          <h3 class="section-title">曲一覧</h3>
          <div class="cards-container">
            <MusicDataCard v-for="(item, index) in currentTabData" :key="index" :data="item" />
          </div>
        </div>
        <p class="footer">
          本サイトは、株式会社コナミデジタルエンタテインメントとは一切関係の無い個人が製作した非公式ファンサイトです。
        </p>
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
      <p>CSVファイルをアップロードしてデータを表示</p>
      <p class="empty-hint">CSVファイルをアップロードすると、各曲ごとのレーダー値が表示されます</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CsvUploader from '@/components/CsvUploader.vue'
import TabSelector from '@/components/TabSelector.vue'
import MusicDataCard from '@/components/MusicDataCard.vue'
import type { CandidatesData, RadarAverageValues } from '@/types'

// データの状態
const candidates = ref<CandidatesData>({
  NOTES: [],
  CHORD: [],
  PEAK: [],
  CHARGE: [],
  SCRATCH: [],
  'SOF-RAN': [],
})

// レーダー平均値
const averageValues = ref<RadarAverageValues>({
  NOTES: '0',
  CHORD: '0',
  PEAK: '0',
  CHARGE: '0',
  SCRATCH: '0',
  'SOF-RAN': '0',
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

// 現在のタブの平均レーダー値
const currentTabAverage = computed(() => {
  return averageValues.value[currentTab.value as keyof RadarAverageValues]
})

// CSVデータが処理されたときのハンドラ
const handleDataProcessed = (data: CandidatesData, avgValues: RadarAverageValues) => {
  candidates.value = data
  averageValues.value = avgValues
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

.footer {
  text-align: left;
  padding: 40px 0;
  color: #666;
  font-size: 0.7rem;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.section-title {
  margin: 30px 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
  font-size: 1.3rem;
}

.excluded-title {
  color: #f57c00;
}

.other-title {
  color: #666;
}

.excluded-cards .card {
  opacity: 0.7;
  border-left: 3px solid #f57c00;
}

.average-radar-container {
  margin: 20px 0 30px;
}

.average-radar-card {
  background: linear-gradient(to right, #4a6cf7, #6a3ef5);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.2);
}

.average-radar-card h3 {
  margin: 0 0 15px;
  font-size: 1.4rem;
  font-weight: 600;
}

.average-value {
  font-size: 3rem;
  font-weight: 700;
  margin: 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.average-description {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 10px 0 0;
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
