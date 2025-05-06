import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import './SocialLinks.css';

const SocialLinks = () => (
    <div className="social-links">
        <a href="https://www.linkedin.com/in/bhavinthakur/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
        </a>
        <a href="https://github.com/bhavinthakur29/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
        </a>
        <a href="mailto:bhavinthakuruk@gmail.com" aria-label="Email">
            <FaEnvelope />
        </a>
    </div>
);

export default SocialLinks; 