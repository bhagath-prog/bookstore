"use client";

import '@fortawesome/fontawesome-free/css/all.min.css';
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* LEFT SECTION */}
        <div className="left-section">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">M</span>
            </div>
            <span className="logo-name">MyCompany</span>
          </div>

          <p className="website-description">
            We are dedicated to providing the best service and quality products 
            to our customers worldwide. Join us on our journey to excellence.
          </p>

          <div className="social-icons">
            <a href="https://www.facebook.com/drlng.seena/" target="_blank" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" className="social-icon">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="#" target="_blank" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="center-section">
          <div className="links-container">
            
            <div className="links-group">
              <h3 className="links-title">Company</h3>
              <ul className="links-list">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Team</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div className="links-group">
              <h3 className="links-title">Support</h3>
              <ul className="links-list">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION → MAP */}
        <div className="right-section">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d124402.15524955447!2d77.61635714405344!3d12.999501012721124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3bae11e5beced50b%3A0x6dfbb6145c02cc8b!2sB133%2F1%2C%202nd%20Floor%2C%20KSSIDC%20ITI%20Estate%2C%20Whitefield%20Main%20Rd%2C%20Mahadevapura%2C%20Bengaluru%2C%20Karnataka%20560048!3m2!1d12.999514!2d77.698759!5e0!3m2!1sen!2sin!4v1764066770243!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location Map"
            ></iframe>
          </div>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <p>
          © 2024 <a href="#" className="company-link">MyCompany</a>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
