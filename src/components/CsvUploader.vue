<template>
  <div class="csv-uploader">
    <div
      class="upload-area"
      :class="{ 'is-dragging': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleFileDrop"
    >
      <div class="upload-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      <div class="upload-text">
        <p>CSVファイルをドラッグ＆ドロップ</p>
        <p>または</p>
      </div>
      <label for="csvInput" class="file-input-label">
        <span>ファイルを選択</span>
        <input
          type="file"
          id="csvInput"
          accept=".csv"
          @change="handleFileUpload"
          class="file-input"
        />
      </label>
    </div>
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-message">ファイルを処理中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Papa from 'papaparse'
import type {
  CSVRow,
  MusicMasterData,
  CandidatesData,
  MusicData,
  RadarAverageValues,
} from '@/types'

const isLoading = ref(false)
const isDragging = ref(false)

const emit = defineEmits<{
  (e: 'data-processed', candidates: CandidatesData, averageValues: RadarAverageValues): void
}>()

// レーダー値のマスターデータ
const musicMasterData = ref<MusicMasterData>({})

// マスターデータの取得
const fetchMasterData = async () => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/awazoooo/csv-upload-sample/refs/heads/main/public/radar.json',
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

// ドラッグ＆ドロップでのファイルアップロード処理
const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      parseCSV(file)
    }
  }
}

// CSVファイルのアップロード処理
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return
  parseCSV(file)
}

// CSVファイルのパース処理
const parseCSV = (file: File) => {
  isLoading.value = true

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      processData(results.data as CSVRow[])
      isLoading.value = false
    },
    error: (error) => {
      console.error('CSVパースエラー:', error)
      isLoading.value = false
    },
  })
}

// CSVデータの処理
const processData = (data: CSVRow[]) => {
  // 一時的なデータ保存用
  const tempData: {
    [kind: string]: {
      [musicName: string]: MusicData[]
    }
  } = {
    NOTES: {},
    CHORD: {},
    PEAK: {},
    CHARGE: {},
    SCRATCH: {},
    'SOF-RAN': {},
  }

  // 最終的な候補データ
  const candidates: CandidatesData = {
    NOTES: [],
    CHORD: [],
    PEAK: [],
    CHARGE: [],
    SCRATCH: [],
    'SOF-RAN': [],
  }

  // 各曲の各難易度のデータを収集
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

        // 曲名ごとにデータを一時保存
        if (!tempData[kind][musicName]) {
          tempData[kind][musicName] = []
        }

        tempData[kind][musicName].push({
          difficulty,
          difficultyNumber,
          maxScore,
          name: musicName,
          rank,
          score: musicScore,
          scoreRate,
          totalNotes: musicData['ALL_NOTES'],
          value: (radarValue * parseFloat(scoreRate)).toFixed(2),
          isExcluded: false, // 除外フラグ（初期値はfalse）
        })
      }
    }
  }

  // 各種別ごとに、同一曲名の曲から最大のレーダー値を持つ難易度のみを選択
  for (const kind in tempData) {
    const kindKey = kind as keyof typeof tempData

    for (const musicName in tempData[kindKey]) {
      // 同一曲名の曲をレーダー値の降順でソート
      tempData[kindKey][musicName].sort((a, b) => parseFloat(b.value) - parseFloat(a.value))

      // 最大のレーダー値を持つ難易度を候補に追加
      candidates[kindKey as keyof CandidatesData].push(tempData[kindKey][musicName][0])

      // 残りの難易度は除外フラグを立てて候補に追加
      for (let i = 1; i < tempData[kindKey][musicName].length; i++) {
        const excludedData = { ...tempData[kindKey][musicName][i], isExcluded: true }
        candidates[kindKey as keyof CandidatesData].push(excludedData)
      }
    }
  }

  // 平均値を保存するオブジェクト
  const averageValues: RadarAverageValues = {
    NOTES: '0',
    CHORD: '0',
    PEAK: '0',
    CHARGE: '0',
    SCRATCH: '0',
    'SOF-RAN': '0',
  }

  // 各種別ごとにレーダー値の降順でソート
  for (const kind in candidates) {
    const kindKey = kind as keyof CandidatesData
    candidates[kindKey].sort((a, b) => {
      // レーダー値で降順ソート
      return parseFloat(b.value) - parseFloat(a.value)
    })

    // 各種別の上位10曲（除外されていない曲のみ）の平均レーダー値を計算
    const topTen = candidates[kindKey].filter((item) => !item.isExcluded).slice(0, 10)

    if (topTen.length > 0) {
      const avgValue = topTen.reduce((sum, item) => sum + parseFloat(item.value), 0) / topTen.length
      averageValues[kindKey] = avgValue.toFixed(2)

      // 上位10曲にフラグを設定
      topTen.forEach((item) => {
        item.isTopTen = true
      })
    }
  }

  emit('data-processed', candidates, averageValues)
}
</script>

<style scoped>
.csv-uploader {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-area {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border: 2px dashed #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f5f7ff;
}

.is-dragging {
  border-color: #4a6cf7;
  background-color: #f0f4ff;
  box-shadow: 0 0 15px rgba(74, 108, 247, 0.2);
}

.upload-icon {
  color: #4a6cf7;
  margin-bottom: 15px;
}

.upload-text {
  text-align: center;
  margin-bottom: 15px;
}

.upload-text p {
  margin: 5px 0;
  color: #666;
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
  box-shadow: 0 4px 6px rgba(74, 108, 247, 0.2);
}

.file-input-label:hover {
  background: #3a5ce5;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(74, 108, 247, 0.25);
}

.file-input {
  display: none;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(74, 108, 247, 0.3);
  border-radius: 50%;
  border-top-color: #4a6cf7;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}
</style>
