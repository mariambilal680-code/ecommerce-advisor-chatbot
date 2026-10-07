import { BadgeCheck, GitCompareArrows, Lightbulb, SearchCheck } from 'lucide-react'

const features = [
  { icon: SearchCheck, number: '01', title: 'Personalized recommendations', text: 'Start with your needs, budget, and priorities. Get options that make sense for your actual life.' },
  { icon: GitCompareArrows, number: '02', title: 'Product comparison', text: 'Cut through spec sheets with side-by-side tradeoffs explained in plain language.' },
  { icon: Lightbulb, number: '03', title: 'Buying guidance', text: 'Understand what matters, what does not, and where spending more is worth it.' },
  { icon: BadgeCheck, number: '04', title: 'Confident decisions', text: 'Move from maybe to clear next steps without pressure or noise.' },
]

export default function FeatureCards() {
  return <section id="features" className="features section-shell"><div className="section-heading"><p className="eyebrow">A better way to shop</p><h2>Make the decision<br /><em>feel lighter.</em></h2></div><div className="feature-grid">{features.map(({ icon: Icon, number, title, text }) => <article className="feature-card" key={number}><div className="feature-top"><span className="feature-icon"><Icon size={20} /></span><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}
