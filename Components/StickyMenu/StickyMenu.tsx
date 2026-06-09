'use client'; 

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
// Resources
import PartifulLogo from '../../public/icons/partiful-logo.png';
import CalendarIcon from '../../public/icons/calendar-icon.svg'
import LocationIcon from '../../public/icons/location-icon.svg'
// CSS
import './StickyMenu.css';

interface StickyMenuProps {
}

const StickyHomeMenu: React.FC<StickyMenuProps> = () => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (menuRef.current) {
                setIsSticky(window.scrollY > menuRef.current.offsetTop);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            ref={menuRef}
            className={`sticky-menu${isSticky ? ' sticky' : ''}`}
            data-testid="sticky-menu"
        >
            <nav>
                <ul>
                    <li key={'partifulLink'}>
                        <a href={'https://partiful.com/e/ak7KgzW3kr3wWjLSUVYQ'}>
                            <Image className="sticky-menu__link partiful-link" src={PartifulLogo} alt="Partiful Logo" />
                        </a>
                    </li>
                </ul>
            </nav>
            <section className="event-details">
                <p className="event-details__info">
                    <Image className='icon calendar-icon' src={CalendarIcon} alt="Calendar Icon" />
                    June 12, 2026 6pm
                </p>
                <p className="event-details__info">
                    <Image className='icon location-icon' src={LocationIcon} alt="Location Icon" />
                    5107 N Clark St, Unit 3S
                </p>
            </section>
        </div>
    );
};

export default StickyHomeMenu;