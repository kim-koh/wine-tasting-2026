'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SendSummaryEmailButton from "./SendSummaryEmailButton/SendSummaryEmailButton";
import "@/app/globals.css"; 
import "./BurgerMenu.css";
const navItems = [
    { icon: "⌂", label: "Home", sub: '', link: '/' },
    { icon: "🍷", label: "Wines", sub: " Learn about the wines", link: '/wines' },
    { icon: "🍴", label: "Dines", sub: " Allergen information", link: '/dines' },
];

export type BurgerMenuProps = {
    className?: string;
};

export default function BurgerMenu({ className }: BurgerMenuProps) {
    const router = useRouter()
    const isAdmin = typeof document !== "undefined" && document.cookie.includes("admin=true");
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const [active, setActive] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);
        
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            {/* Burger trigger */}
            <div className={`burger-sticky ${scrolled ? "scrolled" : ""} ${className ?? ""}`}>
                <button
                    className={`burger-btn ${open ? "open" : ""}`}
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                >
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </button>
            </div>

            {/* Overlay */}
            <div
                className={`overlay ${open ? "visible" : ""}`}
                onClick={() => setOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer */}
            <nav
                ref={menuRef}
                className={`drawer ${open ? "open" : ""}`}
                aria-label="Main navigation"
                aria-hidden={!open}
            >
                <div className="drawer-nav">
                    {/* Main navigation */}
                    <p className="nav-section-label">Navigate</p>

                    {navItems.map((item, i) => (
                        <button
                            key={item.label}
                            className={`nav-item ${active === item.label ? "active" : ""}`}
                            onClick={() => {
                                setActive(item.label);
                                setOpen(false);
                                if (item.link) {
                                    router.push(item.link);
                                }
                            }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                            <span className="nav-text">
                                <span className="nav-label">{item.label}</span>
                                <span className="nav-sub">{item.sub}</span>
                            </span>
                            <span className="nav-arrow" aria-hidden="true">→</span>
                        </button>
                    ))}

                    <div className="nav-divider" />
                    {/* Actions section */}
                    <p className="nav-section-label">Actions</p>
                    <SendSummaryEmailButton onClick={() => setOpen(false)} className="nav-item" />
                    <a href={process.env.NEXT_PUBLIC_GOOGLE_PHOTOS_ALBUM_LINK} className="nav-item" 
                        onClick={() => {
                            setOpen(false)
                        }}
                    >
                        <span className="nav-icon" aria-hidden="true">📷</span>
                        <span className="nav-text">
                            <span className="nav-label">Photo album</span>
                            <span className="nav-sub"> Upload and view photos from the event.</span>
                        </span>
                        <span className="nav-arrow" aria-hidden="true">→</span>
                    </a>

                    {isAdmin && <>
                        <div className="nav-divider" />
                        <p className="nav-section-label">Admin</p>

                        <a href="/admin" className="nav-item" 
                            onClick={() => {
                                setOpen(false)
                            }}
                        >
                            <span className="nav-icon" aria-hidden="true">✶</span>
                            <span className="nav-text">
                                <span className="nav-label">Admin page</span>
                                <span className="nav-sub"> Manage site settings.</span>
                            </span>
                            <span className="nav-arrow" aria-hidden="true">→</span>
                        </a>
                    </>}
                </div>
            </nav>
        </>
    );
}