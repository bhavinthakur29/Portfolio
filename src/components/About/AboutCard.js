import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Bhavin Thakur </span>
            from <span className="purple"> J&K, India.</span>
            <br />
            I am currently pursuing my Masters in Data Science from the University of Hertfordshire, UK.
            <br />
            I have completed B.Sc (Honours) in Physics from Jammu, J&K and Advanced Diploma in Information Technology at STIC Infotech.</p>
          <ul>
            <li className="about-activity">My Hobbies:</li>
            <li className="about-activity">
              <ImPointRight /> Mobile Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Singing
            </li>
            <li className="about-activity">
              <ImPointRight /> Taekwon Do
            </li>
          </ul>

        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
