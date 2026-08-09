import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { IMAGES } from "../lib/images";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={IMAGES.lotusFlower}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-purple/90 via-royal-purple/80 to-emerald-green/85" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="font-display text-2xl md:text-3xl text-white">
            Ready to Take the Next Step?
          </h2>
          <p className="mt-2 text-sm md:text-base text-gold italic font-display">
            Growing Through Every Season of Recovery.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-white px-8 py-3 text-royal-purple font-medium hover:bg-gold hover:text-white transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
          <div className="flex flex-col gap-1 text-sm text-white/90">
            <a
              href="tel:+18044264617"
              className="flex items-center gap-2 hover:text-white"
            >
              <Phone className="h-4 w-4" /> (804) 426-4617
            </a>
            <a
              href="mailto:info@lotusfoundation.info"
              className="flex items-center gap-2 hover:text-white"
            >
              <Mail className="h-4 w-4" /> info@lotusfoundation.info
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
