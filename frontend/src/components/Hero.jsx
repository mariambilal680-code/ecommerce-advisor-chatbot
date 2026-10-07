import { ArrowUpRight, Check, Sparkles } from 'lucide-react'

export default function Hero({ onStart }) {
  return <main id="top" className="hero">
    <div className="hero-copy reveal">
      <p className="eyebrow"><Sparkles size={15} /> Shopping clarity, powered by AI</p>
      <h1>Your intelligent guide to <em>better buys.</em></h1>
      <p className="hero-text">Get thoughtful product recommendations, clear comparisons, and practical guidance tailored to what matters to you.</p>
      <div className="hero-actions"><button className="primary-button" onClick={onStart}>Chat with advisor <ArrowUpRight size={17} /></button><a className="text-link" href="#features">Explore features <ArrowUpRight size={15} /></a></div>
      <div className="trust-row"><span><Check size={14} /> No sales pressure</span><span><Check size={14} /> Built for decisions</span></div>
    </div>
    <div className="hero-preview reveal reveal-delay" aria-label="Chat preview">
      <div className="preview-orbit orbit-one" /><div className="preview-orbit orbit-two" />
      <div className="preview-card">
        <div className="preview-header"><span className="mini-mark">ea</span><div><strong>E-Commerce Advisor</strong><small><i /> Ready to help</small></div><span className="preview-menu">•••</span></div>
        <div className="preview-content"><div className="assistant-bubble">Tell me what you’re shopping for and I’ll help you weigh the options.</div><div className="user-bubble">A laptop for design work, under $1,400.</div><div className="assistant-bubble accent-bubble">Great brief. Let’s prioritize display quality, memory, and sustained performance.</div></div>
        <div className="preview-input">Describe your ideal product <span>↑</span></div>
      </div>
      <div className="preview-note note-top"><span>01</span><strong>Clearer comparisons</strong><small>Less browsing, more confidence</small></div>
      <div className="preview-note note-bottom"><span>02</span><strong>Personal guidance</strong><small>Advice shaped around you</small></div>
    </div>
  </main>
}
