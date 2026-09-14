import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | The Lotus Foundation",
  description:
    "Get in touch with The Lotus Foundation to learn more about our mental health and substance use services in Virginia.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-royal-purple">
            We&apos;re Here to Help
          </p>
          <h1 className="mt-2 font-display text-4xl text-royal-purple">
            Contact The Lotus Foundation
          </h1>
          <span className="mt-4 block h-[3px] w-16 bg-gold mx-auto" />
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            Whether you&apos;re seeking services for yourself or a loved one, or
            want to learn more about The Lotus Foundation, we&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl text-royal-purple">
            Looking for support?
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Use our referral form to tell us what you need. You can answer at
            your own pace and skip questions.
          </p>
          <div className="mt-6">
            <Link className="primary" href="/referral">
              Start a referral
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl text-royal-purple">
              Contact Info
            </h2>
            <div className="mt-4 space-y-3 text-sm text-foreground/80">
              <a
                href="mailto:info@lotusfoundation.info"
                className="block hover:text-teal"
              >
                info@lotusfoundation.info
              </a>
              <a href="tel:+18044264617" className="block hover:text-teal">
                (804) 426-4617
              </a>
              <p>Serving Richmond &amp; Central Virginia</p>
            </div>
          </div>

          <div className="rounded-2xl bg-royal-purple/5 p-6">
            <h3 className="font-display text-lg text-royal-purple">
              Our Commitment
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">
              We are committed to providing high-quality, ethical, and
              evidence-based services that inspire hope, promote recovery, and
              strengthen our community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
