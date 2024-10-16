import { useState, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Upload } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = useCallback((files: FileList) => {
    const file = files[0]
    const reader = new FileReader()
    setIsLoading(true)
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string)
      }
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }, [onImageUpload])

  const onFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const onCameraButtonClick = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
          accept="image/*"
        />
        <Input
          type="file"
          ref={cameraInputRef}
          onChange={handleChange}
          className="hidden"
          accept="image/*"
          capture="environment"
        />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-blue-500">Cargando imagen...</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">Arrastra y suelta una imagen aquí, o</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={onFileButtonClick} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Upload className="mr-2 h-4 w-4" /> Seleccionar imagen
              </Button>
              <Button onClick={onCameraButtonClick} className="bg-green-500 hover:bg-green-600 text-white">
                <Camera className="mr-2 h-4 w-4" /> Usar cámara
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}