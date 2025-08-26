export interface GenerateImageInput {
  prompt: string
  negativePrompt?: string
  seed?: number
  size?: { width: number; height: number }
  steps?: number
  guidance?: number
}

export interface ControlInput extends GenerateImageInput {
  controlImage: string
  controlType: 'scribble' | 'canny' | 'inpaint'
  strength?: number
}

export interface InpaintInput {
  baseImage: string
  maskImage: string
  prompt: string
  strength?: number
  seed?: number
}

export interface ModelPort {
  generateImage(input: GenerateImageInput): Promise<{ imageUrl: string }>
  generateWithControl(input: ControlInput): Promise<{ imageUrl: string }>
  inpaint(input: InpaintInput): Promise<{ imageUrl: string }>
}
