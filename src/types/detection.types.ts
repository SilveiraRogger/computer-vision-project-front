export interface DetectionResult {
  class: string
  confidence: number
  bbox: { x: number; y: number; w: number; h: number }
}

export interface Detection {
  id: string
  image_url: string
  image_url_result: string
  result: DetectionResult[]
}

export interface User {
  id: string
  name: string
  email: string
}