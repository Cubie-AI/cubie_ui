import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void
  currentImage?: string
}

export function UploadDropzone({ onFileSelect, currentImage }: UploadDropzoneProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  })

  return (
    <div 
      {...getRootProps()} 
      className="flex flex-col items-center justify-center h-full text-center cursor-pointer relative"
    >
      <input {...getInputProps()} />
      
      {preview ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <p className="text-white text-sm">Click or drag to change image</p>
          </div>
        </div>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the file here</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Drag & drop an image here,<br />or click to select
            </p>
          )}
        </>
      )}
    </div>
  )
} 