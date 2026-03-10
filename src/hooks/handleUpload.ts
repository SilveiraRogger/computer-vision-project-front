import api from "@/services/api"
import type { DetectionResponse, FileItem, FileStatus } from "@/types/upload.types"
import { useRef, useState } from "react"

export function useUpload(onSuccess?: () => void) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DetectionResponse[]>([])

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const imgs = Array.from(incoming)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
        status: "pending" as FileStatus,
      }))
    setFiles((prev) => [...prev, ...imgs])
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function clearAll() {
    setFiles([])
    setResults([])
  }

  async function handleUpload() {
    if (files.length === 0) return
    setLoading(true)
    setResults([])

    const form = new FormData()
    files.forEach(({ file }) => form.append("files", file))

    try {
      setFiles((prev) => prev.map((f) => ({ ...f, status: "uploading" as FileStatus })))
      const { data } = await api.post<DetectionResponse[]>("/detect", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setFiles((prev) => prev.map((f) => ({ ...f, status: "done" as FileStatus })))
      setResults(data)
      onSuccess?.()
    } catch {
      setFiles((prev) => prev.map((f) => ({ ...f, status: "error" as FileStatus })))
    } finally {
      setLoading(false)
    }
  }

  const allDone = files.length > 0 && files.every((f) => f.status === "done")
  const hasError = files.some((f) => f.status === "error")
  const pending = files.filter((f) => f.status === "pending").length

  return {
    inputRef,
    files,
    dragging,
    setDragging,
    loading,
    results,
    allDone,
    hasError,
    pending,
    addFiles,
    removeFile,
    clearAll,
    handleUpload,
  }
}