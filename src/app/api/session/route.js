export async function POST(request) {
  try {
    const { colabUrl } = await request.json()

    const baseUrl = (colabUrl || process.env.COLAB_URL || '').replace(/\/$/, '')
    if (!baseUrl) {
      return Response.json({ error: 'COLAB_URL not configured' }, { status: 400 })
    }

    const res = await fetch(`${baseUrl}/create_session`, { method: 'POST' })

    if (!res.ok) {
      const fallbackId = crypto.randomUUID()
      return Response.json({ session_id: fallbackId, fallback: true })
    }

    const data = await res.json()
    return Response.json(data)
  } catch (err) {
    // Fallback to a local UUID if Colab is unreachable
    const fallbackId = crypto.randomUUID()
    return Response.json({ session_id: fallbackId, fallback: true })
  }
}
