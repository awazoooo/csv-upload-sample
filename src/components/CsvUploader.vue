<template>
  <div class="csv-uploader">
    <label for="csvInput" class="file-input-label">
      <span>CSVファイルを選択</span>
      <input
        type="file"
        id="csvInput"
        accept=".csv"
        @change="handleFileUpload"
        class="file-input"
      />
    </label>
    <p v-if="isLoading" class="loading-message">ファイルを処理中...</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Papa from 'papaparse'
import type { CSVRow, MusicMasterData, CandidatesData } from '@/types'

const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'data-processed', candidates: CandidatesData): void
}>()

// レーダー値のマスターデータ
const musicMasterData = ref<MusicMasterData>({})

// マスターデータの取得
const fetchMasterData = async () => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/awazoooo/csv-upload-sample/refs/heads/main/radar.json',
    )
    if (!response.ok) {
      throw new Error('HTTPエラー: ' + response.status)
    }
    musicMasterData.value = await response.json()
  } catch (error) {
    console.error('エラー:', error)
  }
}

// コンポーネントのマウント時にマスターデータを取得
fetchMasterData()

// CSVファイルのアップロード処理
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  isLoading.value = true
  console.log('Start loading file...')

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      processData(results.data as CSVRow[])
      isLoading.value = false
      console.log('Finished loading file!!!')
    },
    error: (error) => {
      console.error('CSVパースエラー:', error)
      isLoading.value = false
    },
  })
}

// CSVデータの処理
const processData = (data: CSVRow[]) => {
  const candidates: CandidatesData = {
    NOTES: [],
    CHORD: [],
    PEAK: [],
    CHARGE: [],
    SCRATCH: [],
    'SOF-RAN': [],
  }

  for (const row of data) {
    const musicName = row['タイトル']
    for (const difficulty of ['NORMAL', 'HYPER', 'ANOTHER', 'LEGGENDARIA']) {
      const musicScore = parseInt(row[`${difficulty} スコア`]) || 0
      const musicData = (musicMasterData.value[musicName] || {})[difficulty]

      if (!musicScore || !musicData) continue
      if (musicData['ALL_NOTES'] === 0) continue

      const maxScore = musicData['ALL_NOTES'] * 2
      const scoreRate = (musicScore / maxScore).toFixed(4)
      const difficultyNumber = parseInt(row[`${difficulty} 難易度`])
      const rank = row[`${difficulty} DJ LEVEL`]

      for (const kind of ['NOTES', 'CHORD', 'PEAK', 'CHARGE', 'SCRATCH', 'SOF-RAN'] as const) {
        const radarValue =
          kind === 'SOF-RAN'
            ? musicData['RADAR']['SOF-RAN']
            : musicData['RADAR'][kind as keyof (typeof musicData)['RADAR']]

        if (!radarValue) continue

        candidates[kind].push({
          difficulty,
          difficultyNumber,
          maxScore,
          name: musicName,
          rank,
          score: musicScore,
          scoreRate,
          totalNotes: musicData['ALL_NOTES'],
          value: (radarValue * parseFloat(scoreRate)).toFixed(2),
        })
      }
    }
  }

  // レーダー値の降順ソート
  for (const kind in candidates) {
    candidates[kind as keyof CandidatesData].sort(
      (a, b) => parseFloat(b.value) - parseFloat(a.value),
    )
  }

  emit('data-processed', candidates)
}
</script>

<style scoped>
.csv-uploader {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-input-label {
  display: inline-block;
  padding: 12px 24px;
  background: #4a6cf7;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.file-input-label:hover {
  background: #3a5ce5;
}

.file-input {
  display: none;
}

.loading-message {
  margin-top: 10px;
  color: #666;
}
</style>
