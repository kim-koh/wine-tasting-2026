'use client'
// Components
import Image from "next/image"
import SendSummaryEmailButton from "../BurgerMenu/SendSummaryEmailButton/SendSummaryEmailButton";
// Hooks
import { useParty } from "@/hooks/EventStateProvider"
// Resources
import GooglePhotosIcon from '../../public/icons/google-photos-icon.png'
// CSS
import './HomeNavSection.css'

export default function HomeBottomSection() {
    const { partyStateLocal } = useParty();
    return (<div className="home-bottom-section">
        {partyStateLocal == 'After event' ? <h2>Thanks for joining us, see you again next year!</h2> : null}
        <div className={`main__nav ${partyStateLocal == 'After event' ? 'after-event' : ''}`}>
            <div className='main__buttons'>
                <h2 className='main__label'>Navigation</h2>
                <a className='wine-info-btn' href="/wines">View Wine Info</a>
                <a className='food-info-btn' href="/dines">View Dietary Info</a>
            </div>
            <div className='main__actions'>
                <h2 className='main__label'>Actions</h2>
                {partyStateLocal === 'During event (show wine images)' || partyStateLocal === 'After event' ? <SendSummaryEmailButton style='small' /> : null}
                <a href={process.env.GOOGLE_PHOTOS_ALBUM_LINK} className='photo-album-btn'>
                    <Image src={GooglePhotosIcon} alt="Google Photos Icon" className='google-photos-icon' />
                    Google Photos Album
                </a>
            </div>
        </div>
    </div>)
}