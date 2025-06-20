
import "../../styles/Footer.css"; // Link to external CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h2 className="footer-title">
            <a href="/">ElectroThrift</a>
          </h2>
          <p>
            Buy and sell used electronics at Nepal's trusted thrift platform.
            Affordable, reliable, and sustainable.
          </p>
        </div>

        {/* Links Section */}
        <div className="footer-section">
          <h3 className="footer-subtitle">Links</h3>
          <ul className="footer-list">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-subtitle">
            <a href="/contactus">Contact Us</a>
          </h3>
          <p>📍 Kathmandu, Nepal</p>
          <p>📧 support@electrothrift.com</p>
          <p>🌐 www.electrothrift.com</p>
        </div>
      </div>

      <div className="footer-copy">
        &copy; {new Date().getFullYear()} ElectroThrift. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
