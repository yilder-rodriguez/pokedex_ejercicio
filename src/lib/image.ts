const MAX_FILE_BYTES = 10 * 1024 * 1024

export async function resizeToSquare(file: File, size = 256): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo seleccionado no es una imagen.')
  if (file.size > MAX_FILE_BYTES) throw new Error('La imagen es demasiado grande (máximo 10 MB).')

  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const side = Math.min(img.naturalWidth, img.naturalHeight)
    const sx = (img.naturalWidth - side) / 2
    const sy = (img.naturalHeight - side) / 2

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Tu navegador no permite procesar imágenes.')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
    return canvas.toDataURL('image/jpeg', 0.85)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    img.src = src
  })
}
