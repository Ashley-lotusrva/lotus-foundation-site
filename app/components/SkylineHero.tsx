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
      <div className="absolute inset-0 bg-gradient-to-b from-royal-purple/55 via-royal-purple/25 to-royal-purple/65" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="font-display italic text-gold text-lg">
          Healing Happens Here. Hope Begins Today.
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-white max-w-2xl">
          Rising Above. Growing Within.
        </h1>
        <p className="mt-6 text-base md:text-lg text-white/85 max-w-lg">
          The Lotus Foundation empowers individuals living with mental health
          and substance use challenges through compassionate, evidence-based,
          person-centered behavioral health services &mdash; rooted in
          Richmond, Virginia.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-white px-7 py-3 text-royal-purple font-medium hover:bg-gold hover:text-white transition-colors"
          >
            Get in Touch
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-white px-7 py-3 text-white font-medium hover:bg-white hover:text-royal-purple transition-colors"
          >
            Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}
