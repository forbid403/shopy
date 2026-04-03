const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23f3f4f6" width="400" height="400"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="system-ui,sans-serif" font-size="14">Image not available</text></svg>`

export const FALLBACK_IMAGE = `data:image/svg+xml,${svg}`

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget
  if (img.src !== FALLBACK_IMAGE) {
    img.src = FALLBACK_IMAGE
  }
}
