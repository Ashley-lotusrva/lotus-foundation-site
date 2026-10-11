import Link from "next/link";
export function Crisis() {
  return (
    <p className="hub-notice">
      This website is not monitored for emergencies. For immediate danger or a
      medical emergency, call <a href="tel:911">911</a>. For crisis support,
      call or text <a href="tel:988">988</a>.
    </p>
  );
}
export function Availability() {
  return (
    <aside className="hub-notice">
      <strong>Contact us for current availability.</strong> Pantry access,
      training opportunities, and rental or utility assistance depend on current
      capacity. Financial assistance is limited, subject to eligibility and
      available funding, and is not guaranteed.{" "}
      <Link href="/contact">Talk with our team →</Link>
    </aside>
  );
}
export function Intro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="hub-intro">
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
      <div>{children}</div>
    </header>
  );
}
