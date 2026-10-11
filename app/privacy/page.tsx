import { Intro } from "../components/Hub";
export default function Page() {
  return (
    <div className="hub">
      <Intro
        label="Referral privacy"
        title="Share what helps us take the next step."
      />
      <section className="hub-panel">
        <h2>Your request</h2>
        <p>
          The referral asks for contact details, requested support, and basic
          household information so the team can review and route the request.
          Optional questions help understand community needs and prepare program
          reports.
        </p>
        <h2>What happens to your answers?</h2>
        <p>
          Unsent answers remain in this page’s memory and clear when you close
          or refresh it. When online submissions are available, sending saves
          the request for approved Foundation staff. The form does not
          automatically share your answers with outside partners or an AI
          service.
        </p>
        <h2>Keep sensitive details for a private conversation</h2>
        <p>
          Do not enter Social Security numbers, medical records, medication
          lists, or detailed trauma histories here. Staff can explain any later
          information request and permissions needed for partner coordination.
        </p>
        <h2>Your choices</h2>
        <p>
          Use safe-contact instructions, skip optional questions, or ask to
          speak with staff. Contact info@lotusfoundation.info or (804) 426-4617
          to ask about an answer, correction, or information handling. Do not
          include sensitive records in email.
        </p>
      </section>
    </div>
  );
}
