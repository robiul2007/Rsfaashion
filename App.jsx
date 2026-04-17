import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import Background from './Background';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pricingRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!pricingRef.current) return;
      
      let scrollY = window.scrollY;
      let triggerPoint = pricingRef.current.offsetTop - window.innerHeight;
      
      let progress = 0;
      if (scrollY > triggerPoint) {
        progress = Math.min(1, (scrollY - triggerPoint) / 600);
      }
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inject CSS Variables dynamically for smooth performance
  const dynamicStyles = {
    '--night-opacity': scrollProgress,
    '--day-opacity': 1 - scrollProgress,
    '--shape-scale': 1 - (scrollProgress * 0.8)
  };

  const isNight = scrollProgress > 0.5;

  return (
    <div className={`app-wrapper ${isNight ? 'is-night' : ''}`} style={dynamicStyles}>
      <Background />

      <nav className="navbar">
        <div className="container nav-container">
          <a href="#" className="logo">Raizo<span className="text-accent">.space</span></a>
          <a href="https://wa.me/910000000000" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Let's Talk</a>
        </div>
      </nav>

      <section className="hero container">
        <div className="hero-content">
          <h1>Raizo.space | Calm Design.<br/>Powerful Results.</h1>
          <p>Premium Digital Agency | Emotionally Connected, Exceptionally Functional Websites.</p>
        </div>
      </section>

      <section className="container">
        <div className="trust-banner">
          <div className="trust-item">
            <div className="trust-icon">🛡️</div>
            <div className="trust-text">
              <h4>No Hidden Fees</h4>
              <p>Absolute transparency. No surprise server charges.</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">⚡</div>
            <div className="trust-text">
              <h4>Hand-Coded Precision</h4>
              <p>Pure code built from scratch so your site loads instantly.</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🤝</div>
            <div className="trust-text">
              <h4>Direct Communication</h4>
              <p>Speak directly with the lead developer via WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2>Our <span className="text-accent">3-Step</span> Deployment</h2>
          <p>A frictionless process designed to get you online fast.</p>
        </div>
        <div className="process-grid">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3>Strategy & Assets</h3>
            <p>Send us your logo and details via WhatsApp. We handle the rest.</p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3>Design & Coding</h3>
            <p>We build your custom digital storefront optimized for mobile speed.</p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3>Launch & Handover</h3>
            <p>Approve the live link, and we connect your custom domain.</p>
          </div>
        </div>
      </section>

      <section ref={pricingRef} className="section container">
        <div className="section-header">
          <h2>Simple, transparent <span className="text-accent">pricing.</span></h2>
          <p>Invest in a digital asset that works for you 24/7.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <h3>The Starter</h3>
            <div className="price">₹11,999</div>
            <ul className="price-features">
              <li>1 Custom Landing Page</li>
              <li>Mobile Responsive</li>
              <li>WhatsApp Integration</li>
              <li>5 Days Delivery</li>
            </ul>
            <a href="#" className="btn btn-outline" style={{ width: '100%' }}>Select Plan</a>
          </div>
          
          <div className="price-card popular">
            <div className="popular-badge">Best Value</div>
            <h3>The Clinic Model</h3>
            <div className="price">₹14,999</div>
            <ul className="price-features">
              <li>Up to 3 Pages</li>
              <li>Booking Form Setup</li>
              <li>Google Maps Embed</li>
              <li>Free 1-Year Hosting</li>
            </ul>
            <a href="#" className="btn btn-primary" style={{ width: '100%' }}>Select Plan</a>
          </div>
          
          <div className="price-card">
            <h3>The Enterprise</h3>
            <div className="price">₹29,999</div>
            <ul className="price-features">
              <li>Up to 5 Pages</li>
              <li>Custom JavaScript</li>
              <li>Analytics Dashboard</li>
              <li>Priority Support</li>
            </ul>
            <a href="#" className="btn btn-outline" style={{ width: '100%' }}>Select Plan</a>
          </div>
          
          <div className="price-card">
            <h3>The Ultimate</h3>
            <div className="price">₹44,999</div>
            <ul className="price-features">
              <li>Up to 10 Pages</li>
              <li>Full Booking Engine</li>
              <li>Advanced SEO Setup</li>
              <li>24/7 Dedicated Support</li>
            </ul>
            <a href="#" className="btn btn-outline" style={{ width: '100%' }}>Select Plan</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
