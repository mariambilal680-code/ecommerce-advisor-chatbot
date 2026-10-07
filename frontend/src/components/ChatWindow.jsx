import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ChevronLeft, Clock3, Menu, Plus, X } from 'lucide-react'
import { sendChat } from '../api/chatbot'

const welcome = { role: 'assistant', content: "Hi! I'm your E-Commerce Advisor.\n\nI can help you find products, compare options, understand specifications, and choose based on your budget.\n\nWhat are you looking for today?", timestamp: new Date() }
const suggestions = ['Find a laptop for programming', 'Compare two smartphones', 'Recommend headphones under $100', 'Help me choose a camera']

function formatTime(date) { return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(date)) }

export default function ChatWindow({ onClose }) {
  const [conversations, setConversations] = useState([{ id: crypto.randomUUID(), title: 'New shopping conversation', messages: [welcome], updatedAt: new Date() }])
  const [activeId, setActiveId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const active = conversations.find((item) => item.id === activeId) || conversations[0]

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [active?.messages, loading])
  useEffect(() => { if (!activeId && conversations[0]) setActiveId(conversations[0].id) }, [activeId, conversations])

  function newChat() { const conversation = { id: crypto.randomUUID(), title: 'New shopping conversation', messages: [welcome], updatedAt: new Date() }; setConversations((items) => [conversation, ...items]); setActiveId(conversation.id); setHistoryOpen(false); setError('') }

  async function submitMessage(value = input) {
    const content = value.trim()
    if (!content || loading) return
    const userMessage = { role: 'user', content, timestamp: new Date() }
    const nextMessages = [...active.messages, userMessage]
    setInput(''); setError(''); setLoading(true)
    setConversations((items) => items.map((item) => item.id === active.id ? { ...item, title: item.title === 'New shopping conversation' ? content.slice(0, 34) : item.title, messages: nextMessages, updatedAt: new Date() } : item))
    try {
      const response = await sendChat({ conversationId: active.id, messages: nextMessages.filter((message) => message.role !== 'assistant' || message !== welcome).map(({ role, content: text }) => ({ role, content: text })) })
      const assistantMessage = { ...response.message, timestamp: new Date() }
      setConversations((items) => items.map((item) => item.id === active.id ? { ...item, messages: [...nextMessages, assistantMessage], updatedAt: new Date() } : item))
    } catch (requestError) { setError(requestError.name === 'AbortError' ? 'The advisor took too long to respond. Please try again.' : 'Sorry, I couldn’t connect to the advisor right now. Please try again.') }
    finally { setLoading(false) }
  }

  function handleKeyDown(event) { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submitMessage() } }

  return <section className="chat-window" role="dialog" aria-label="E-Commerce Advisor chat">
    <header className="chat-header"><div className="chat-title"><span className="online-mark">ea</span><div><strong>E-Commerce Advisor</strong><small><i /> Online</small></div></div><div className="chat-actions"><button onClick={() => setHistoryOpen(true)} aria-label="Open conversation history"><Clock3 size={17} /><span>History</span></button><button onClick={onClose} aria-label="Close chat"><X size={19} /></button></div></header>
    <div className={`chat-body ${historyOpen ? 'show-history' : ''}`}>
      <aside className="history-panel"><div className="history-heading"><button onClick={() => setHistoryOpen(false)} aria-label="Close history"><ChevronLeft size={18} /></button><strong>Conversation history</strong></div><button className="new-chat" onClick={newChat}><Plus size={16} /> New chat</button><div className="history-list">{conversations.map((item) => <button className={`history-item ${item.id === active.id ? 'selected' : ''}`} key={item.id} onClick={() => { setActiveId(item.id); setHistoryOpen(false) }}><strong>{item.title}</strong><small>{formatTime(item.updatedAt)}</small></button>)}</div></aside>
      <div className="conversation"><div className="message-list">{active.messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.timestamp}-${index}`}><div className="message-bubble">{message.content.split('\n').map((line, lineIndex) => <span key={lineIndex}>{line}{lineIndex < message.content.split('\n').length - 1 && <br />}</span>)}</div><time>{formatTime(message.timestamp)}</time></div>)}{active.messages.length === 1 && <div className="suggestion-grid">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => submitMessage(suggestion)}>{suggestion}<ArrowUp size={14} /></button>)}</div>}{loading && <div className="message-row assistant"><div className="typing"><span /><span /><span /></div><small>Advisor is thinking</small></div>}{error && <div className="error-message" role="alert">{error}</div>}<div ref={endRef} /></div><div className="composer"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask your shopping question..." aria-label="Message" rows="1" disabled={loading} /><button className="send-button" onClick={() => submitMessage()} disabled={!input.trim() || loading} aria-label="Send message"><ArrowUp size={18} /></button><small>Enter to send · Shift + Enter for a new line</small></div></div>
    </div>
  </section>
}
