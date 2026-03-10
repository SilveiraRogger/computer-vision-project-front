export type FileStatus = "pending" | "uploading" | "done" | "error"

export interface FileItem {
  file: File
  preview: string
  status: FileStatus
}

export interface BBox {
  x: number
  y: number
  w: number
  h: number
}

export interface DetectionResult {
  class: string
  confidence: number
  bbox: BBox
}

export interface DetectionResponse {
  id: string
  image_url: string
  image_url_result: string
  result: DetectionResult[]
  user_id: string
}