export interface MusicData {
  difficulty: string
  difficultyNumber: number
  isExcluded?: boolean
  isTopTen?: boolean
  maxScore: number
  name: string
  rank: string
  score: number
  scoreRate: string
  totalNotes?: number
  value: string
}

export type RadarKinds = 'NOTES' | 'CHORD' | 'PEAK' | 'CHARGE' | 'SCRATCH' | 'SOF-RAN'

export interface MusicMasterData {
  [musicName: string]: {
    [difficulty: string]: {
      ALL_NOTES: number
      RADAR: Record<RadarKinds, number>
    }
  }
}

export type CandidatesData = Record<RadarKinds, MusicData[]>

export type RadarAverageValues = Record<RadarKinds, number>

export interface CSVRow {
  バージョン: string
  タイトル: string
  ジャンル: string
  アーティスト: string
  プレー回数: string
  [key: string]: string // 難易度ごとのスコアなど
}
