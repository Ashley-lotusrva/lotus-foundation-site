import Link from "next/link";
import { Intro, Crisis, Availability } from "../components/Hub";
export const metadata = { title: "Contact | The Lotus Foundation" };
export default function Page() {
  return (
    <div className="hub">
      <Intro label="Contact" title="Talk with The Lotus Foundation.">
        <p>
          Ask about help, referrals, partnerships, volunteering, or current
          availability.
        </p>
      </Intro>
      <div className="hub-grid">
        <section className="hub-card">
          <h2>Reach our team</h2>
          <p>
            <a href="tel:+18044264617">(804) 426-4617</a>
          </p>
          <p>
            <a href="mailto:info@lotusfoundation.info">
              info@lotusfoundation.info
            </a>
          </p>
          <p>
            Please do not send detailed medical records or other sensitive
            documents by email.
          </p>
          <Link href="/accessibility">
            Request accessibility or language support →
          </Link>
        </section>
        <section className="hub-card">
          <h2>Start with what you need</h2>
          <p>
            Our short referral form helps organize a request. Contact us for
            current response times and availability.
          </p>
          <Link className="hub-button" href="/get-help">
            Get Help
          </Link>
        </section>
      </div>
      <Availability />
      <p>
        Contact the team to confirm location, hours, and travel arrangements
        before visiting.
      </p>
      <Crisis />
    </div>
  );
}
