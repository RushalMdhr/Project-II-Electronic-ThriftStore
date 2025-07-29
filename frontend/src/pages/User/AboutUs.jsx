// import React,{ useState,useEffect } from 'react'


// import BackgroundImage from '../assets/Background-Image.jpg';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105"
          src="/background image.jpg"
          alt="About Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        <div className="relative z-10 text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl tracking-wide">
            About Us
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white/90 rounded-2xl shadow-2xl border border-green-200 p-8 backdrop-blur-md animate-fade-in-up">
          <section className="mb-10">
            <h2 className="text-3xl font-extrabold text-green-700 mb-3 drop-shadow">
              Who we are?
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Welcome to <span className="font-semibold text-green-700">Electronic Thrift Store</span> — your trusted destination for quality pre-owned electronics in Kathmandu. Located in the heart of Bhaktapur, we are proud to be Nepal’s unique store dedicated exclusively to buying and selling gently used electronic devices. Since 2020, we have been empowering tech lovers across the country to embrace sustainability while enjoying affordable technology.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-3 drop-shadow">
              What we do?
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              At Electronic Thrift Store Nepal, we believe that great technology shouldn’t come with a hefty price tag. Explore our wide range of carefully tested smartphones, laptops, cameras, tablets, and accessories — all available at unbeatable prices. Whether you’re upgrading your devices or looking to sell your electronics with confidence, our seamless Become a Seller process makes it easy to join our growing community. Experience quality, reliability, and value — all under one roof.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 drop-shadow">
              Our Mission And Vision
            </h2>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-green-700 mb-1">Our Mission</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                At Electronic Thrift Store, our mission is to bridge the gap between cutting-edge technology and affordability. We are committed to providing high-quality, pre-owned electronics that empower every Nepali to stay connected and thrive, while championing sustainability. Through transparency, trust, and exceptional customer service, we create a welcoming community where every device is given a second life—helping reduce e-waste and enrich lives across Nepal.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-1">Our Vision</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                We envision a future where sustainable technology is within everyone’s reach. As Nepal’s premier electronic thrift store, we strive to foster a culture of conscious consumption, where each purchase contributes to a greener, cleaner planet. By expanding our offerings and elevating our services, we aim to be the trusted destination for affordable, reliable electronics that inspire innovation and opportunity for generations ahead.
              </p>
            </div>
          </section>

          <p className="mt-10 text-center text-2xl italic font-bold text-green-800 bg-gradient-to-r from-green-100 via-blue-100 to-green-100 rounded-xl px-8 py-6 shadow-lg border border-green-200 animate-pulse">
            "Join us in making smarter, greener technology choices—because the future belongs to those who reuse, recycle, and renew."
          </p>
        </div>
      </div>
    </div>
  );
}