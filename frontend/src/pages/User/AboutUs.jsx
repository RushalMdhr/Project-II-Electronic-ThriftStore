// import React,{ useState,useEffect } from 'react'
import "../styles/AboutUs.css";
// import BackgroundImage from '../assets/Background-Image.jpg';

export default function AboutUs() {

  return (
    <div>
      
      <div className="Aboutus">
        
        <img className="bg-image" src="/Background-Image.jpg" alt="About Background" />     
        <h1 className="Title"> About Us</h1>
        
        <p className="subtopic"> Who we are?
        </p>
        <p className="sub-paragraph"> Welcome to Electronic Thrift Store  — 
          your trusted destination for quality pre-owned electronics 
          in Kathmandu. Located in the heart of Bhaktapur, we are proud
          to be Nepal’s unique store dedicated exclusively to 
          buying and selling gently used electronic devices. Since 2020,
          we have been empowering tech lovers across the country to 
          embrace sustainability while enjoying affordable technology.</p>
        
        <p className="subtopic"> What we do?
        </p>
        <p className="sub-paragraph"> At Electronic Thrift Store Nepal, we 
          believe that great technology shouldn’t come with a hefty price 
          tag. Explore our wide range of carefully tested smartphones, 
          laptops, cameras, tablets, and accessories — all available at 
          unbeatable prices. Whether you’re upgrading your devices or 
          looking to sell your electronics with confidence, our seamless 
          Become a Seller process makes it easy to join our growing community. 
          Experience quality, reliability, and value — all under one roof.</p>
        
      
      </div>
    
      <div>
          <h1 className="Title"> Our Mission And Vision </h1>
          <p className="subtopic"> Our Mission
        </p>
          <p className="sub-paragraph">At Electronic Thrift Store ,
             our mission is to bridge the gap between cutting-edge technology
            and affordability. We are committed to providing high-quality,
            pre-owned electronics that empower every Nepali to stay
            connected and thrive, while championing sustainability. 
            Through transparency, trust, and exceptional customer 
            service, we create a welcoming community where every 
            device is given a second life—helping reduce e-waste 
            and enrich lives across Nepal.
          </p>

            <p className="subtopic"> Our Vision
        </p>
        <p className="sub-paragraph">We envision a future where sustainable
          technology is within everyone’s reach. As Nepal’s premier 
          electronic thrift store, we strive to foster a culture of
          conscious consumption, where each purchase contributes to a 
          greener, cleaner planet. By expanding our offerings and
          elevating our services, we aim to be the trusted destination 
          for affordable, reliable electronic that inspire innovation and opportunity for generations ahead.

        </p>
      </div>
      <p className="slogan">"Join us in making smarter, 
        greener technology choices—because the future 
         to those who reuse, recycle, and renew."</p>
    </div>
  );
}
