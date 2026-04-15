
import {
  FaBookOpen,
  FaGlobe,
  FaBullseye,
  FaComments,
  FaUsers,
  FaShippingFast,
  FaAward,
  FaHeadset,
  FaEye,
  FaFlagCheckered,
} from "react-icons/fa";
import "./about.css";

const About = () => {
  return (
    <section className="about-container">
      <div className="about-hero">
        <div className="about-image">
          <img 
            src="./assets/images/f.png" 
            alt="Book Collection" 
            className="hero-image"
          />
        </div>
        <div className="about-content">
          <h2>About BookHub</h2>
          <p>
            Welcome to BookHub - your premier destination for quality books across all genres.
            We are passionate about connecting readers with their next favorite book while supporting
            authors and promoting literacy worldwide.
          </p>
          <div className="about-stats">
            <div className="stat-box">
              <FaGlobe className="stat-icon" />
              <h4>1500+</h4>
              <p>Global Readers</p>
            </div>
            <div className="stat-box">
              <FaBookOpen className="stat-icon" />
              <h4>500+</h4>
              <p>Books Published</p>
            </div>
            <div className="stat-box">
              <FaUsers className="stat-icon" />
              <h4>300+</h4>
              <p>Authors</p>
            </div>
            <div className="stat-box">
              <FaComments className="stat-icon" />
              <h4>100K+</h4>
              <p>Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ecommerce-features">
        <h2>Why Choose BookHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaShippingFast className="feature-icon" />
            <h3>Fast Delivery</h3>
            <p>Free shipping on orders over $50. Delivery within 2-5 business days.</p>
          </div>
          <div className="feature-card">
            <FaAward className="feature-icon" />
            <h3>Quality Guarantee</h3>
            <p>All books are carefully selected and checked before shipping.</p>
          </div>
          <div className="feature-card">
            <FaHeadset className="feature-icon" />
            <h3>24/7 Support</h3>
            <p>We are always available to help you.</p>
          </div>
          <div className="feature-card">
            <FaBookOpen className="feature-icon" />
            <h3>Wide Selection</h3>
            <p>More than enough books for every reader.</p>
          </div>
        </div>
      </div>

      <div className="company-values">
        <div className="values-container">
          <div className="value-card mission">
            <FaBullseye className="value-icon" />
            <h2>MISSION</h2>
            <p>To make literature accessible to everyone with affordable pricing and a vast collection.</p>
          </div>
          <div className="value-card vision">
            <FaEye className="value-icon" />
            <h2>VISION</h2>
            <p>To be the world's most trusted platform for book lovers.</p>
          </div>
          <div className="value-card goals">
            <FaFlagCheckered className="value-icon" />
            <h2>GOALS</h2>
            <p>Grow to 10,000+ titles and support global literacy programs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;