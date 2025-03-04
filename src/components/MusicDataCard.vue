<template>
  <div class="card" :class="{ 'top-ten': data.isTopTen, excluded: data.isExcluded }">
    <div class="card-header">
      <div class="value-container">
        <span class="value-label">レーダー値</span>
        <span class="value">{{ data.value }}</span>
      </div>
      <div class="right-header">
        <span v-if="data.isTopTen" class="top-ten-badge">TOP 10</span>
        <span v-if="data.isExcluded" class="excluded-badge">同一曲除外</span>
        <span class="difficulty" :class="difficultyClass">{{ data.difficulty }}</span>
      </div>
    </div>
    <div class="card-body">
      <h3 class="music-name">{{ data.name }}</h3>
      <div class="score-details">
        <div class="score-bar">
          <div
            class="score-progress"
            :style="{ width: formatScoreRate(data.scoreRate) + '%' }"
          ></div>
        </div>
        <div class="score-info">
          <div class="score-numbers">
            <span class="score">{{ data.score }}/{{ data.maxScore }}</span>
            <span class="score-rate">{{ formatScoreRate(data.scoreRate) }}%</span>
          </div>
          <span class="rank" :class="rankClass">{{ data.rank }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MusicData } from '@/types'

const props = defineProps<{
  data: MusicData
}>()

// 難易度に応じたクラスを返す
const difficultyClass = computed(() => {
  const difficulty = props.data.difficulty
  switch (difficulty) {
    case 'NORMAL':
      return 'normal'
    case 'HYPER':
      return 'hyper'
    case 'ANOTHER':
      return 'another'
    case 'LEGGENDARIA':
      return 'leggendaria'
    default:
      return ''
  }
})

// ランクに応じたクラスを返す
const rankClass = computed(() => {
  const rank = props.data.rank
  if (!rank) return ''

  if (rank.includes('AAA')) return 'rank-aaa'
  if (rank.includes('AA')) return 'rank-aa'
  if (rank.includes('A')) return 'rank-a'
  if (rank.includes('B')) return 'rank-b'
  if (rank.includes('C')) return 'rank-c'
  if (rank.includes('D')) return 'rank-d'
  if (rank.includes('E')) return 'rank-e'
  if (rank.includes('F')) return 'rank-f'

  return ''
})

// スコアレートをフォーマット
const formatScoreRate = (scoreRate: string) => {
  return (parseFloat(scoreRate) * 100).toFixed(2)
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* 対象外曲のスタイル */
.excluded {
  background: #f0f0f0;
  opacity: 0.8;
}

.excluded .card-header {
  background: linear-gradient(to right, #e8e8e8, #e0e0e0);
}

.excluded .card-body {
  background: #f5f5f5;
}

/* TOP 10曲のスタイル */
.top-ten {
  border-left: 3px solid #4a6cf7;
  box-shadow: 0 3px 15px rgba(74, 108, 247, 0.15);
}

.card-header {
  padding: 14px 18px;
  background: linear-gradient(to right, #f8f9fa, #f0f2f5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.value-container {
  display: flex;
  flex-direction: column;
}

.value-label {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 2px;
}

.value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  background: linear-gradient(45deg, #4a6cf7, #6a3ef5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.difficulty {
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.normal {
  background: linear-gradient(to right, #4caf50, #43a047);
  color: white;
}

.hyper {
  background: linear-gradient(to right, #ff9800, #f57c00);
  color: white;
}

.another {
  background: linear-gradient(to right, #f44336, #e53935);
  color: white;
}

.leggendaria {
  background: linear-gradient(to right, #9c27b0, #8e24aa);
  color: white;
}

.card-body {
  padding: 18px;
}

.music-name {
  margin: 0 0 12px 0;
  font-size: 1.15rem;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.score-progress {
  height: 100%;
  background: linear-gradient(to right, #4a6cf7, #6a3ef5);
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.score-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.score-numbers {
  display: flex;
  gap: 12px;
}

.score {
  color: #666;
}

.score-rate {
  font-weight: 600;
  color: #333;
}

.rank {
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.rank-aaa {
  background: linear-gradient(to right, #ffd700, #ffca28);
  color: #333;
}

.rank-aa {
  background: linear-gradient(to right, #c0c0c0, #b0b0b0);
  color: #333;
}

.rank-a {
  background: linear-gradient(to right, #cd7f32, #bf6c24);
  color: white;
}

.rank-b {
  background: linear-gradient(to right, #4a6cf7, #3a5ce5);
  color: white;
}

.rank-c,
.rank-d,
.rank-e,
.rank-f {
  background: linear-gradient(to right, #666, #555);
  color: white;
}

/* バッジのスタイル */
.right-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-ten-badge,
.excluded-badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.top-ten-badge {
  background: linear-gradient(to right, #4a6cf7, #6a3ef5);
  color: white;
}

.excluded-badge {
  background: linear-gradient(to right, #f57c00, #ff9800);
  color: white;
}
</style>
