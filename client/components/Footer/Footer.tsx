import React from "react";
import "./Footer.css";
import { FaYoutube, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p className="footer-subtitle">
          Interactive courses — learn anytime, anywhere.
        </p>
        <h2 className="footer-heading">Teaching Since <span>2012</span></h2>
      </div>

      <div className="footer-main">
        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <h4>Subscribe newsletter</h4>
          <p>
            Subscribe our newsletter to get the latest news and updates!
          </p>
          <div className="newsletter-input">
            <input type="email" placeholder="enter your email" />
            <button>Subscribe</button>
          </div>

          <div className="footer-logo">
            <div className="logo-circle"></div>
            <span className="logo-text">LearnGenix</span>
          </div>
          <p className="footer-tagline">
            Master in-demand tech, business, and creative skills
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div>
            <h5>Quick Links</h5>
            <ul>
              <li>Our courses</li>
              <li>Our story</li>
              <li>Our mentors</li>
              <li>Testimonials</li>
              <li>Contact us</li>
            </ul>
          </div>
          <div>
            <h5>More</h5>
            <ul>
              <li>Blogs</li>
              <li>Jobs</li>
            </ul>
          </div>
          <div>
            <h5>Legal & Policy Links</h5>
            <ul>
              <li>Our rules</li>
              <li>Our statement</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="social-icons">
          <FaYoutube />
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
        </div>
        <div className="footer-bottom-links">
          <span>Privacy policy</span>
          <span>Terms and conditions</span>
          <span>Copyright</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
