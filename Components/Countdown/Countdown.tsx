"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParty } from "@/hooks/EventStateProvider";
import './Countdown.css';

function zeroPad(num: number) {
  return String(num).padStart(2, "0");
}

type CountdownProps = {
  eventDate: Date; 
  children?: React.ReactElement;
};

export default function EventCountdown({ eventDate, children }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const { countdownState } = useParty();
  function getTimeLeft() { 
    const diff = countdownState === 'forceDone' ? 0 : Math.max(0, eventDate?.getTime() - Date.now());
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      completed: diff === 0,
    };
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const rafRef = useRef<number | null>(null);
  const lastSecondRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const currentSecond = Math.floor(Date.now() / 1000);
    if (currentSecond !== lastSecondRef.current) {
      lastSecondRef.current = currentSecond;
      setTimeLeft(getTimeLeft());
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Step 1: mark as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 2: only start the rAF loop after mounted
  useEffect(() => {
    if (!mounted) return;

    rafRef.current = requestAnimationFrame(tick);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        lastSecondRef.current = null;
        setTimeLeft(getTimeLeft());
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [mounted, tick]);

  if (!mounted) {
    // Render static initial value during SSR / before hydration
    const initial = getTimeLeft();
    return <StaticCountdown {...initial} />;
  }

  if (timeLeft.completed) {
    return <div>{children}</div>;
  }

  return <StaticCountdown {...timeLeft} />;
}

function StaticCountdown({ days, hours, minutes, seconds }: {
  days: number; hours: number; minutes: number; seconds: number;
}) {
  return (
    <section className="countdown__container">
      <p className="countdown__subtitle">Fifth annual wine fest in:</p>
      <div className="countdown__timer" key={`${days}${hours}${minutes}${seconds}`}>
        <div className="countdown__card">
          <div className="countdown__card-value">{zeroPad(days)}</div>
          <div className="countdown__card-label">DAYS</div>
        </div>
        <span className="countdown__separator">:</span>
        <div className="countdown__card">
          <div className="countdown__card-value">{zeroPad(hours)}</div>
          <div className="countdown__card-label">HOURS</div>
        </div>
        <span className="countdown__separator">:</span>
        <div className="countdown__card">
          <div className="countdown__card-value">{zeroPad(minutes)}</div>
          <div className="countdown__card-label">MINUTES</div>
        </div>
        <span className="countdown__separator">:</span>
        <div className="countdown__card">
          <div className="countdown__card-value">{zeroPad(seconds)}</div>
          <div className="countdown__card-label">SECONDS</div>
        </div>
      </div>
      <p className="countdown__teaser">
        Check back here for wine info and event activities once the event has begun!
      </p>
    </section>
  );
}