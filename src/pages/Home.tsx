import { Hero } from '../components/hero/Hero'
import { About } from '../components/About'
import { Story } from '../components/Story'
import { Built } from '../components/Built'
import { Life } from '../components/Life'
import { Lens } from '../components/Lens'
import { Community } from '../components/Community'
import { Research } from '../components/Research'
import { Writing } from '../components/Writing'
import { Finale } from '../components/Finale'
import { Footer } from '../components/Footer'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Story />
      <Built />
      <Life />
      <Lens />
      <Community />
      <Research />
      <Writing />
      <Finale />
      <Footer />
    </>
  )
}
