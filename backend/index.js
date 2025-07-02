const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const fetch = require('node-fetch')

dotenv.config()

const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.json())

app.post('/api/gemini/chat', async (req, res) => {
  const userMessage = req.body.message
  if (!userMessage) return res.status(400).json({ error: 'No message provided' })

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    )

    const data = await geminiRes.json()
    console.log('🔍 Gemini raw response:', JSON.stringify(data, null, 2))
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
    res.json({ reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to connect to Gemini API' })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Gemini backend running on http://localhost:${PORT}`)
})
