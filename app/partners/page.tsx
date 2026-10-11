import Link from "next/link";
import { Intro } from "../components/Hub";
export default function Page() {
  return (
    <div className="hub">
      <Intro
        label="Partner with us"
        title="Help referrals become real connections."
      >
        <p>
          We welcome organizations committed to respectful support, clear next
          steps, and follow-up.
        </p>
      </Intro>
      <section className="hub-panel">
        <h2>Who can connect?</h2>
        <p>
          Behavioral health and recovery providers, housing organizations,
          training schools, employers, landlords, food and clothing donors,
          faith communities, and funders.
        </p>
        <h2>Start a conversation</h2>
        <p>
          Tell us about your organization, who you serve, eligibility, and the
          best contact for referrals. Please do not send participant records in
          a general inquiry.
        </p>
        <Link className="hub-button" href="/contact">
          Discuss a partnership
        </Link>
        <p>
          Organizations mentioned in planning materials are prospective
          partners, not a published list of confirmed partnerships.
        </p>
      </section>
    </div>
  );
}
