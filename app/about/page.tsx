import { Intro } from "../components/Hub";
export default function Page() {
  return (
    <div className="hub">
      <Intro
        label="About The Lotus Foundation"
        title="You should not have to navigate it alone."
      >
        <p>
          The Lotus Foundation is building a community resource hub for Greater
          Richmond: a welcoming place to explore care, everyday resources, and
          career pathways.
        </p>
      </Intro>
      <section className="hub-panel">
        <h2>Our mission</h2>
        <p>
          The Lotus Foundation connects individuals and families across Greater
          Richmond to the care, resources, and career pathways they need to
          build stability and thrive. Through coordinated navigation, behavioral
          health and recovery partnerships, housing stabilization, basic-needs
          support, and workforce training connections, we help people take
          practical steps forward.
        </p>
        <h2>Our vision</h2>
        <p>
          A community where every person can find a clear path to wellness, safe
          housing, economic opportunity, and long-term stability without having
          to navigate complex systems alone.
        </p>
        <h2>What guides the work</h2>
        <p>
          Dignity, access, collaboration, accountability, lived experience, and
          responsible use of technology.
        </p>
        <h2>Our community</h2>
        <p>
          Richmond, East Highland Park, Henrico County, Chesterfield County, and
          nearby communities. Program and partner eligibility may vary.
        </p>
      </section>
    </div>
  );
}
