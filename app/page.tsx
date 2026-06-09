import Image from 'next/image';
// Components
import EventCountdown from '@/Components/Countdown/Countdown';
import StickyHomeMenu from '@/Components/StickyMenu/StickyMenu';
import { ErrorBoundary } from '@/Components/ErrorBoundary/ErrorBoundary';
import HomeBottomSection from '@/Components/HomeNavSection/HomeNavSection';
// Resources
import wineGlassClink from '../public/wine-glasses-clink.gif'
// CSS
import './page.css'

export default function Home() { 
  return (
    <div>
      <main className="main">
        <StickyHomeMenu />
        <div className='main-container'>
          <div className='top-section'>
            <div className="intro">
              <div className='intro__title'>
                <p className="intro__title-top">Welcome to Kim & Calvin's...</p>
                <h1 className="intro__title-primary">Midsommar Night's Scheme</h1>
                <p className='intro__title-year'>aka Wine Tasting 2026</p>
              </div>
            </div>
            <Image src={wineGlassClink} alt="Wine Tasting 2026 Logo" className="wine-glasses-clink" />  
          </div>         
          <ErrorBoundary>
          <EventCountdown eventDate={new Date("2026-06-12T18:00:00-05:00")}> 
            <HomeBottomSection />
          </EventCountdown>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}
