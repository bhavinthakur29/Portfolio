import { Row, Button } from "react-bootstrap";
import Particle from "../Particle";

function Contact() {
    return (
        <div id="main-contact-container">
            <div className="contact-section">
                <Particle />

                <form className="contact-form" action="https://api.web3forms.com/submit" method="POST">

                    <Row>
                        <h1 style={{fontWeight: '900', textAlign: 'center'}}>Contact Form</h1>
                    </Row>

                    <Row style={styles}>
                    <input type="hidden" name="access_key" value="40683657-6544-46e5-b082-2338283311a5" />
                    </Row>

                    <Row style={styles}>
                        <input name="Name" id="formName" type="text" placeholder="Your name" />
                    </Row>

                    <Row style={styles}>
                        <input name="Email" id="formEmail" type="email" placeholder="Email" required />
                    </Row>

                    <Row style={styles}>
                        <textarea name="Message" id="formMessage" rows={4} placeholder="Start typing..." required />
                    </Row>

                    <Row style={styles}>
                        <Button style={styles} type="submit">Submit</Button>
                    </Row>

                </form>


            </div>

            <div className="contact-section" id="contact-text">

                <h1 style={{textAlign: 'left'}}>Just fill out the form and hit <span className="purple"><strong>Submit</strong></span> if you want to contact me.</h1>

            </div>

        </div>
    );
}

const styles = {
    justifyContent: "center",
    position: "relative",
    margin: ".7rem 0",
}

export default Contact;