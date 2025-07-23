import React, { useEffect, useState, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./AktiveNachbarn.css";

const nachbarn = [
  { name: "Erika Adler", status: "online" },
  { name: "Hans Müller", status: "online" },
  { name: "Petra Schmidt", status: "away" },
  { name: "Lukas Becker", status: "online" },
  { name: "Mila Fischer", status: "away" },
  { name: "Jonas Weber", status: "online" },
  { name: "Sophie Hoffmann", status: "away" },
  { name: "Maximilian Braun", status: "online" },
  { name: "Lea Zimmermann", status: "away" },
  { name: "Tim Richter", status: "online" },
  { name: "Anna Klein", status: "away" },
  { name: "Paul Schmitt", status: "online" },
  { name: "Laura Wagner", status: "away" },
  { name: "Felix Schwarz", status: "online" },
  { name: "Nina Koch", status: "away" },
  { name: "Tobias Lang", status: "online" },
  { name: "Julia Weiß", status: "away" },
  { name: "David Hartmann", status: "online" },
  { name: "Sarah König", status: "away" },
];

function AktiveNachbarn() {
  const [index, setIndex] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % nachbarn.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const person = nachbarn[index];

  return (
    <aside className="notification-nachbarn">
      <h3>👥 Aktive Nachbarn</h3>
<TransitionGroup component={null}>
<CSSTransition
  key={person.name}
  timeout={800}
  classNames="slide-fade"
  nodeRef={nodeRef}
>
  <div ref={nodeRef}>
    <ul className="nachbarn-list">
      <li>
        {person.name}
        <span className={`status ${person.status}`}></span>
      </li>
    </ul>
  </div>
</CSSTransition>

</TransitionGroup>
      </aside>
  );
}

export default AktiveNachbarn;