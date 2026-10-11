import { Intro } from "../components/Hub";
export default function Page() {
  return (
    <div className="hub">
      <Intro
        label="Access and respect"
        title="Let us know what would make this easier."
      />
      <section className="hub-panel">
        <p>
          We aim to welcome people respectfully and make requesting help
          understandable. You can ask for help reading the form, an interpreter,
          or support with hearing, vision, mobility, or communication needs.
        </p>
        <p>
          Call <a href="tel:+18044264617">(804) 426-4617</a> or email{" "}
          <a href="mailto:info@lotusfoundation.info">
            info@lotusfoundation.info
          </a>{" "}
          to request an alternative way to connect or report a barrier. Contact
          us to discuss available support.
        </p>
        <p>
          Optional demographic answers do not affect access to help. Eligibility
          for individual services depends on the relevant program’s
          requirements.
        </p>
      </section>
    </div>
  );
}
