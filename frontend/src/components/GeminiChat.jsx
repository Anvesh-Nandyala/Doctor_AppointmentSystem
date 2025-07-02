import React, { useState, useRef, useEffect } from 'react'

const GeminiChat = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    setMessages(prev => [...prev, { from: 'user', text: input }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      const reply = data.reply || data.error?.message || 'No response'

      setMessages(prev => [...prev, { from: 'bot', text: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Error connecting to Gemini API.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 max-h-[500px] bg-white border shadow-lg rounded-md flex flex-col z-[9999]">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t-md font-semibold">Gemini Chat</div>
      <div className="flex-1 overflow-y-auto p-2 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={`my-2 ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${m.from === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded text-sm"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-3 py-1 rounded text-sm" disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default GeminiChat
