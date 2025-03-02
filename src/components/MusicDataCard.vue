<template>
  <div class="card">
    <div class="card-header">
      <span class="value">{{ data.value }}</span>
      <span class="difficulty" :class="difficultyClass">{{ data.difficulty }}</span>
    </div>
    <div class="card-body">
      <h3 class="music-name">{{ data.name }}</h3>
      <div class="score-info">
        <span class="score">{{ data.score }}/{{ data.maxScore }}</span>
        <span class="score-rate">{{ formatScoreRate(data.scoreRate) }}%</span>
        <span class="rank" :class="rankClass">{{ data.rank }}</span>
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
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 12px 16px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

.normal {
  background: #4caf50;
  color: white;
}

.hyper {
  background: #ff9800;
  color: white;
}

.another {
  background: #f44336;
  color: white;
}

.leggendaria {
  background: #9c27b0;
  color: white;
}

.card-body {
  padding: 16px;
}

.music-name {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #333;
}

.score-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.9rem;
}

.score {
  color: #555;
}

.score-rate {
  font-weight: 500;
  color: #333;
}

.rank {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.rank-aaa {
  background: #ffd700;
  color: #333;
}

.rank-aa {
  background: #c0c0c0;
  color: #333;
}

.rank-a {
  background: #cd7f32;
  color: white;
}

.rank-b {
  background: #4a6cf7;
  color: white;
}

.rank-c,
.rank-d,
.rank-e,
.rank-f {
  background: #666;
  color: white;
}
</style>
