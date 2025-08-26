# Models Module (Swappable)

Wraps text-to-image, inpainting, and control (doodle) interfaces behind a common API. Default stack: SDXL/Flux + ControlNet (Scribble/Canny).

## Port interface
- generateImage({ prompt, negativePrompt, seed, size, steps, guidance }) → imageUrl
- generateWithControl({ prompt, controlImage, controlType, strength, seed }) → imageUrl
- inpaint({ baseImage, maskImage, prompt, strength, seed }) → imageUrl

## Providers
- Hosted API (e.g., Stability, Replicate, OpenRouter-compatible) for speed to MVP.
- Local runner (InvokeAI/ComfyUI/Automatic1111 API) for on-prem or advanced users.

## Replaceability
- Each provider implements the same functions; a factory selects by env.

## Constraints & quality
- Supports style/palette locks, seeds, and character embeddings (future).
- Control strength knob to reduce hallucinations and adhere to doodles.
