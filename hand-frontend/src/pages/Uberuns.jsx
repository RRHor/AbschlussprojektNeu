import './Uberuns.css';
import image from '../assets/nachbarshaft.avif';
import uberuns2 from '../assets/uberuns2.jpg';
import uberuns3 from '../assets/uberuns3.jpg';
import Nazli from '../assets/personalphoto/Nazli.png';
import Dominik from '../assets/personalphoto/Dominik.png';
import Rea from '../assets/personalphoto/Rea.avif';
import Brian from '../assets/personalphoto/Brian.png';
import Arben from '../assets/personalphoto/Arben.png';
import Dagmar from '../assets/personalphoto/Dagmar.png';
import city from '../assets/video/city.mp4';

const Uberuns = () => {
  return (
    <div className="about-container">
      <h1 className="about-header">Über Hand in Hand</h1>

    {/* TEAM SECTION */}
    <section className="team-section">
        <h2>Wer wir sind</h2>
        <div className="team-grid">
            {[
                { name: "Rea", role: "React & Backend", img: Rea },
                { name: "Nazli", role: "UI, UX & Frontend", img: Nazli },
                { name: "Dagmar", role: "Backend", img: Dagmar },
                { name: "Arben", role: "Coordination Backend & Frontend", img: Arben },
                { name: "Dominik", role: "Frontend", img: Dominik },
                { name: "Brian", role: "Backend", img: Brian },
            ].map((person) => (
                <div className="team-member" key={person.name}>
                    <img src={person.img} alt={person.name} loading="lazy" />
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                </div>
            ))}
        </div>
    </section>

    {/* VIDEO SECTION */}
    <section className="video-section">
        <h2>Erlebe Nachbarschaft</h2>
        <video
            src={city}
            type="video/mp4"
            controls
            muted
            autoPlay
            loop
            className="nachbarschaft-video"
        />
    </section>
    <section className="about-section">
        <div className="about-text-block">
            <h2>Was ist Hand in Hand?</h2>
          <p>
            Auf dieser Plattform können Nachbar:innen miteinander in Kontakt treten,
            Veranstaltungen entdecken, sich über Neuigkeiten austauschen und gegenseitige Hilfe anbieten.
            Gemeinsam stärken wir menschliche Beziehungen, lernen voneinander und finden Antworten
            auf Fragen des Zusammenlebens in unserem Viertel – mit der Unterstützung unserer Nachbarschaft.
          </p>
        </div>
        <div className="about-image-container">
          <img src={image} alt="Nachbarschaft" />
        </div>
        
      </section>

      {/* SECTION 2 - image left */}
      <section className="about-section reverse">
        <div className="about-text-block">
          <h2>Unsere Mission</h2>
          <p>
            Bei <strong>Hand in Hand</strong> glauben wir, dass Nachbarschaft mehr ist als nur eine Adresse. 
            Wir schaffen eine Plattform, auf der Menschen sich gegenseitig unterstützen, Geschenke teilen, 
            Events organisieren und echte Verbindungen aufbauen können.
          </p>
          <div className="about-image-container">
          <img src={uberuns2} alt="Unsere Mission" />
        </div>
        </div>
      </section>

      {/* SECTION 3 - image right */}
      <section className="about-section">
        <div className="about-text-block">
          <h2>Was uns antreibt</h2>
          <p>
            In einer Welt voller Hektik wollen wir einen Raum schaffen, in dem gegenseitige Hilfe, 
            Vertrauen und Menschlichkeit im Vordergrund stehen. Jeder kann etwas geben – 
            und jeder darf etwas brauchen.
          </p>
        </div>
        <div className="about-image-container">
          <img src={uberuns3} alt="Was uns antreibt" />
        </div>
      </section>
    </div>
  );
};

export default Uberuns;
