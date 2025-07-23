// import ImageCarousel from '../components/ImageCarousel';
// import './LandingPage.css';
// import frage from "../assets/animation/Animation - frage.json"; // Importiere die Lottie-Animation für die Frage
// import telecom from '../assets/animation/Animation - 1751891973276.json'; // Importiere die Lottie-Animation für die Telekom
// import tauschen from '../assets/animation/Animation - tauschen.json'; // Importiere die Lottie-Animation für Tauschen
// import events from '../assets/animation/Animation - events.json'; // Importiere die Lottie-Animation für Events

// import landingphoto1 from '../assets/landingphoto/landingphoto1.png';
// import landingphoto2 from '../assets/landingphoto/landingphoto2.png';
// import landingphoto3 from '../assets/landingphoto/landingphoto3.png';
// import landingphoto4 from '../assets/landingphoto/landingphoto4.png';
// import landingphoto5 from '../assets/landingphoto/landingphoto5.avif'
// import Lottie from 'lottie-react';
// import city from '../assets/video/city.mp4';

// const landingphoto = [
//   landingphoto1,
//   landingphoto2,
//   landingphoto3,
//   landingphoto4,
//   landingphoto5,
// ];

// function LandingPage() {
//   return (
    
//     <div className="landing-container">
//       {/* VIDEO SECTION */}
//           <section className="video-section">
//               <h1>Wilkommen in Hand in Hand Nachbarschaftshilfe</h1>
//               <video
//                   src={city}
//                   type="video/mp4"
//                   controls
//                   muted
//                   autoPlay
//                   loop
//                   className="nachbarschaft-video"
//               />
//           </section> 

//       {/* Image Carousel */}
//       <ImageCarousel images={landingphoto} />
//       <section className="landing-content">
//         <h2>Erlebe Nachbarschaft</h2>
//         <p>Gemeinsam in der Nachbarschaft helfen und verbunden bleiben.</p>
//         <div className="cta-buttons">
//           <a href="./Register" className="btn primary">Jetzt Registieren</a>
//           <a href="./Uberuns" className="btn secondary">Über uns</a>
//         </div>
// {/* Events */}
// <section id="events" className="section-block section-colored">
//   <h2>🎉 Events in deiner Nähe</h2>
//   <Lottie animationData={events} loop={true} className="events-animation" />
//   {/* <img src={landingphoto5} alt="events" /> */}
//   <p>Entdecke lokale Veranstaltungen und triff Nachbarn.</p>
//   <a href="./Events" className="btn primary">Alle Events</a>
// </section>

//       <section id="verschenke" className="section-block">
//         <h2>🎁 Verschenke & Tausche</h2>
//         {/*<img src={landingphoto2} alt="verschenke-tauschen-event" />*/}
//         <Lottie animationData={tauschen} loop={true} className="tauschen-animation" />
//         <p>Gib Dingen ein zweites Leben – verschenke oder tausche mit Nachbarn.</p>
//         <a href="./Exchange" className="btn primary">Angebote ansehen</a>
//       </section>

//       {/* Blog */}
//       <section id="blog" className="section-block section-colored">
//         <h2>📝 Blog & Geschichten</h2>
//         {/*<img src={landingphoto3} alt="blog-event" />*/}
//         <Lottie animationData={telecom} loop={true} className="telecom-animation" />
//         <p>Erfahre mehr über inspirierende Nachbarschaftsprojekte und Tipps.</p>
//         <a href="./Blog" className="btn primary">Zum Blog</a>
//       </section>

//       {/* Ask */}
//       <section id="ask" className="section-block">
//         <h2>❓ Häufige Fragen</h2>
//         {/*<img src={landingphoto5} alt="frage-event" />*/}
    
//         <Lottie animationData={frage} loop={true} className="frage-animation" />
//         <p>Du hast Fragen? Wir haben Antworten für dich gesammelt.</p>
//         <a href="./Help" className="btn secondary">Häufige Fragen</a>
        
//       </section>

//      {/* {/* Hilfe */}
//      {/*} <section id="hilfe" className="section-block help-bg">
//         <h2>🤝 Hilfe & Unterstützung</h2>
//         <img src={landingphoto4} alt="hilfe-event" />
//         <p>Unsere Community steht dir bei Fragen und Anliegen zur Seite.</p>
//         <p>Hier findest du Antworten auf häufige Fragen und kannst uns direkt kontaktieren.</p>
//         <p>Brauchst du Hilfe oder Unterstützung? Wir sind für dich da.</p>
//         <button className="btn primary">Hilfeseite öffnen</button>
//       </section> */}

//       </section>
//     </div>
//   );
// }

// export default LandingPage;

import ImageCarousel from '../../components/ImageCarousel';
import './LandingPage.css';
import frage from "../../assets/animation/Animation - frage.json";
import telecom from '../../assets/animation/Animation - 1751891973276.json';
import tauschen from '../../assets/animation/Animation - tauschen.json';
import events from '../../assets/animation/Animation - events.json';

import landingphoto1 from '../../assets/landingphoto/landingphoto1.png';
import landingphoto2 from '../../assets/landingphoto/landingphoto2.png';
import landingphoto3 from '../../assets/landingphoto/landingphoto3.png';
import landingphoto4 from '../../assets/landingphoto/landingphoto4.png';
import landingphoto5 from '../../assets/landingphoto/landingphoto5.avif';
import Lottie from 'lottie-react';
import city from '../../assets/video/city.mp4';
import Countdown from 'react-countdown';
import AktiveNachbarn from '../../components/AktiveNachbarn';

const landingphoto = [
  landingphoto1,
  landingphoto2,
  landingphoto3,
  landingphoto4,
  landingphoto5,
];

function LandingPage() {
  return (
    <>
      {/* Video Section */}
      <section className="video-section-fixed">
        <video
          src={city}
          type="video/mp4"
          controls
          muted
          autoPlay
          loop
          className="nachbarschaft-video"
        />
        <div className="video-overlay">
          <h1>Willkommen bei "Hand in Hand - die Nachbarschaftshilfe"</h1>
        </div>
      </section>

      {/* Notifications & Highlights Row */}
      <div className="landing-layout">
      <div className="notifications-row">
        <aside className="left-notification">
          <h3>📢 Wichtig</h3>
          <ul>
            <li>📍 Neuer Event: <strong>Nachbarschaftsgrill:</strong>am 25.07.2025!</li>
            <li>🆕 Tauschbörse: <strong className="blink">Neue Angebote</strong></li>
          </ul>
        </aside>
        <AktiveNachbarn />

        <aside className="right-notification">
  <h3>⏳ Nächstes Event</h3>
  <p><strong>Sommerfest</strong></p>
  <p>Startet in: <Countdown date={"2025-08-15T18:00:00"} /></p>
</aside>

      </div>
          <ImageCarousel className="carousel-container" images={landingphoto} />
        <section className="landing-content">
          <h2>Erlebe Nachbarschaft</h2>
          <p>Gemeinsam helfen, teilen und feiern – werde Teil unserer lebendigen Community!</p>
          <div className="cta-buttons">
            <a href="./Register" className="btn">Jetzt Registrieren</a>
            <a href="./Uberuns" className="btn">Über uns</a>
          </div>
        </section>
      </div>
      
<div className="section-grid">
  <div className="section-row">
    <section id="events" className="section-block">
      <h2>🎉 Events in deiner Nähe</h2>
      <Lottie animationData={events} loop={true} className="events-animation" />
      <p>Entdecke lokale Veranstaltungen und triff Nachbarn.</p>
      <a href="./Events" className="btn secondary">Alle Events</a>
    </section>

    <section id="verschenke" className="section-block">
      <h2>🎁 Verschenke & Tausche</h2>
      <Lottie animationData={tauschen} loop={true} className="tauschen-animation" />
      <p>Gib Dingen ein zweites Leben – verschenke oder tausche mit Nachbarn.</p>
      <p>Wenn Sie Hilfe brauchen oder andere unterstützen können, dann los geht's!</p>
      <a href="./Exchange" className="btn secondary">Angebote ansehen</a>
    </section>
  </div>

  <div className="section-row">
    <section id="blog" className="section-block">
      <h2>📝 Blog & Geschichten</h2>
      <Lottie animationData={telecom} loop={true} className="telecom-animation" />
      <p>Erfahre mehr über inspirierende Nachbarschaftsprojekte und Tipps.</p>
      <a href="./Blog" className="btn secondary">Zum Blog</a>
    </section>

    <section id="ask" className="section-block">
      <h2>❓ Häufige Fragen</h2>
      <Lottie animationData={frage} loop={true} className="frage-animation" />
      <p>Du hast Fragen? Wir haben Antworten für dich gesammelt.</p>
      <a href="./Help" className="btn secondary">Häufige Fragen</a>
    </section>
  </div>
</div>


    </>
  );
}

export default LandingPage;



