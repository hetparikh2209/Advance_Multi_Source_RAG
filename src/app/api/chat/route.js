export async function POST(request) {
  try {
    const { query, session_id, n_chunks, colabUrl } = await request.json()

    const baseUrl = (colabUrl || process.env.COLAB_URL || '').replace(/\/$/, '')
    if (!baseUrl) {
      return Response.json({ error: 'COLAB_URL not configured' }, { status: 400 })
    }

    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, session_id, n_chunks }),
    })

    if (!res.ok) {
      const text = await res.text()
      return Response.json({ error: `Colab error: ${text}` }, { status: res.status })
    }

    const data = await res.json()
    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
