import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-royal-purple text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/lotus-logo.png"
                alt="The Lotus Foundation logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="font-display text-lg">The Lotus Foundation</span>
            </div>
            <p className="mt-3 font-display italic text-gold text-sm">
              Rising Above. Growing Within.
            </p>
            <p className="mt-4 text-sm text-white/70 max-w-xs">
              Empowering individuals living with mental health and substance use
              challenges through compassionate, evidence-based care.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Explore
            </h3>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/services" className="hover:text-white">Services</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Contact
            </h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/80">
              <a
                href="mailto:info@lotusfoundation.info"
                className="hover:text-white"
              >
                info@lotusfoundation.info
              </a>
              <a href="tel:+18044264617" className="hover:text-white">
                (804) 426-4617
              </a>
              <span>Serving Richmond &amp; Central Virginia</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-center text-xs text-white/60">
          &copy; {new Date().getFullYear()} The Lotus Foundation. Empowering Lives.
          Restoring Hope. Building Futures.
        </div>
      </div>
    </footer>
  );
}
