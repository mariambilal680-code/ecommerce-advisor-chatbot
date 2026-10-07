import { ArrowUpRight } from 'lucide-react'

export default function Navbar({ onStart }) {
  return <header className="navbar">
    <a className="brand" href="#top" aria-label="E-Commerce Advisor home">
      <span className="brand-mark">ea</span><span>E-Commerce Advisor</span>
    </a>
    <nav className="nav-links" aria-label="Primary navigation">
      <a href="#top">Home</a><a href="#features">Features</a><a href="#about">About</a>
    </nav>
    <button className="nav-cta" onClick={onStart}>Start shopping assistance <ArrowUpRight size={16} /></button>
  </header>
}
