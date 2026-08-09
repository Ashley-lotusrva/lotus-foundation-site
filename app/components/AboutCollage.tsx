import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "../lib/images";

export default function AboutCollage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-royal-purple">
          About Us
        </p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl text-royal-purple">
          Rooted in Compassion.
          <br />
          Driven by Purpose.
        </h2>
        <span className="mt-4 block h-[3px] w-16 bg-gold" />
        <p className="mt-6 text-sm md:text-base leading-relaxed text-foreground/75">
          The Lotus Foundation is a behavioral health organization dedicated
          to creating meaningful, lasting change right here in Richmond and
          Central Virginia.
        </p>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-foreground/75">
          We partner with individuals and families of all backgrounds to
          build the skills, support, and stability needed to live safely and
          independently &mdash; meeting people where they are on their
          recovery journey.
        </p>
        <Link
          href="/about"
          className="mt-6 inline-block text-royal-purple font-medium underline decoration-gold underline-offset-4 hover:text-teal"
        >
          Learn more about us &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <Image
            src={IMAGES.counseling}
            alt="A case manager talking warmly with a client"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 45vw, 22vw"
          />
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden mt-8">
          <Image
            src={IMAGES.supportGroup}
            alt="A small support group in conversation"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 45vw, 22vw"
          />
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden -mt-8">
          <Image
            src={IMAGES.journaling}
            alt="Hands writing in a workbook"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 45vw, 22vw"
          />
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <Image
            src={IMAGES.caseWork}
            alt="A case worker helping a client with paperwork"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 45vw, 22vw"
          />
        </div>
      </div>
    </section>
  );
}
