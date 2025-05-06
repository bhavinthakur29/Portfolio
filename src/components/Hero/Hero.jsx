import './Hero.css';

const Hero = () => (
    <section className="hero">
        {/* Replace src with your VC image path when available */}
        <img src="/src/assets/vc-placeholder.png" alt="Bhavin Thakur" className="hero-img" />
        <h1>Bhavin Thakur</h1>
        <h2>Digital Marketing Manager & Web Developer</h2>
        <p>Experienced in content writing, SEO, web management, and digital marketing strategy.</p>
        <a href="#contact" className="hero-cta">Contact Me</a>
    </section>
);

export default Hero; 