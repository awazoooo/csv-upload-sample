export interface MusicData {
  difficulty: string
  difficultyNumber: number
  maxScore: number
  name: string
  rank: string
  score: number
  scoreRate: string
  totalNotes?: number
  value: string
}

export interface MusicMasterData {
  [musicName: string]: {
    [difficulty: string]: {
      ALL_NOTES: number
      RADAR: {
        NOTES?: number
        CHORD?: number
        PEAK?: number
        CHARGE?: number
        SCRATCH?: number
        'SOF-RAN'?: number
      }
    }
  }
}

export interface CandidatesData {
  NOTES: MusicData[]
  CHORD: MusicData[]
  PEAK: MusicData[]
  CHARGE: MusicData[]
  SCRATCH: MusicData[]
  'SOF-RAN': MusicData[]
}

export interface CSVRow {
  バージョン: string
  タイトル: string
  ジャンル: string
  アーティスト: string
  プレー回数: string
  [key: string]: string // 難易度ごとのスコアなど
}
