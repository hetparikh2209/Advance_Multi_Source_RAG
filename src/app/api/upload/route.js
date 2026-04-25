export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const colabUrl = formData.get('colabUrl') || process.env.COLAB_URL || ''

    const baseUrl = colabUrl.replace(/\/$/, '')
    if (!baseUrl) {
      return Response.json({ error: 'COLAB_URL not configured' }, { status: 400 })
    }

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Forward multipart to Colab
    const upstream = new FormData()
    upstream.append('file', file)

    const res = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: upstream,
    })

    if (!res.ok) {
      const text = await res.text()
      return Response.json({ error: `Colab upload error: ${text}` }, { status: res.status })
    }

    const data = await res.json()
    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
