"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const HERO_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_35D3VzWXANSXMVdQIRlv19buLJh/hf_20260809_030718_88376713-c7aa-4628-aca9-8ed0100cfa8f.png";

export default function SkylineHero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!imgRef.current) return;
      const offset = window.scrollY * 0.35;
      imgRef.current.style.transform = `translateY(${offset}px)`;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-[600px] md:h-[640px] overflow-hidden">
      <div
        ref={imgRef}
        className="absolute inset-0 -top-24 h-[calc(100%+12rem)] will-change-transform"
      >
        <Image
          src={HERO_IMAGE}
          alt="Richmond, Virginia skyline at dusk over the James River"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-royal-purple/80 via-black/45 to-royal-purple/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-royal-purple/70" />
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 pb-16">
        <div className="max-w-2xl">
          <p className="font-display italic text-gold text-base md:text-lg [text-shadow:0_2px_10px_rgba(0,0,0,0.85)]">
            Healing Happens Here. Hope Begins Today.
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
            Rising Above.
            <br />
            <span className="text-teal-200">Growing Within.</span>
          </h1>
          <span className="mt-4 block h-[3px] w-24 bg-gold" />
          <p className="mt-6 text-base md:text-lg text-white max-w-lg [text-shadow:0_1px_8px_rgba(0,0,0,0.75)]">
            The Lotus Foundation empowers individuals living with mental
            health and substance use challenges through compassionate,
            evidence-based, person-centered behavioral health services
            &mdash; rooted in Richmond, Virginia.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-white px-7 py-3 text-royal-purple font-medium hover:bg-gold hover:text-white transition-colors shadow-lg"
            >
              Get in Touch
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white px-7 py-3 text-white font-medium hover:bg-white hover:text-royal-purple transition-colors bg-black/10"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
