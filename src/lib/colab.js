/**
 * Shared helper to resolve the Colab base URL.
 * Priority: argument passed in request body > COLAB_URL env var
 */
export function resolveColabUrl(urlFromRequest) {
  const url = urlFromRequest || process.env.COLAB_URL || ''
  return url.trim().replace(/\/$/, '')
}

/**
 * Thin wrapper around fetch for Colab endpoints with a timeout.
 */
export async function colabFetch(path, options = {}, timeoutMs = 30000) {
  const baseUrl = resolveColabUrl(options.colabUrl)
  if (!baseUrl) throw new Error('COLAB_URL is not configured')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: controller.signal,
    })
    return res
  } finally {
    clearTimeout(timer)
  }
}
