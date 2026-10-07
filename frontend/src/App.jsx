import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureCards from './components/FeatureCards'
import ChatWindow from './components/ChatWindow'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  return <div className="app"><Navbar onStart={() => setChatOpen(true)} /><Hero onStart={() => setChatOpen(true)} /><FeatureCards /><section id="about" className="about section-shell"><p className="eyebrow">The human side of product search</p><h2>Good advice starts with<br /><em>the right questions.</em></h2><p>Shopping should feel less like sorting through noise and more like having a thoughtful second opinion. E-Commerce Advisor helps you get there.</p></section><footer className="footer section-shell"><span>ea · E-Commerce Advisor</span><span>Clearer choices for everyday life.</span></footer><button className={`floating-chat ${chatOpen ? 'active' : ''}`} onClick={() => setChatOpen((open) => !open)} aria-label={chatOpen ? 'Close advisor chat' : 'Open advisor chat'}>{chatOpen ? <X size={24} /> : <MessageCircle size={24} />}<span className="floating-ping" /></button>{chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}</div>
}
