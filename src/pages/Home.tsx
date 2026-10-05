import { Hero } from '../components/hero/Hero'
import { About } from '../components/About'
import { Work } from '../components/Work'
import { Research } from '../components/Research'
import { Writing } from '../components/Writing'
import { Finale } from '../components/Finale'
import { Footer } from '../components/Footer'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Research />
      <Writing />
      <Finale />
      <Footer />
    </>
  )
}
