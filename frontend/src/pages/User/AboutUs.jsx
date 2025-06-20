// import React,{ useState,useEffect } from 'react'
// import BackgroundImage from '../assets/Background-Image.jpg';

export default function AboutUs() {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-72 md:h-96">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          src="/Background-Image.jpg"
          alt="About Background"
        />
        <div className="relative flex flex-col items-center justify-center h-full bg-black/40">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">About Us</h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium">Your trusted destination for quality pre-owned electronics</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Who we are?</h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Welcome to <span className="font-semibold text-blue-600">Electronic Thrift Store</span> — your trusted destination for quality pre-owned electronics in Kathmandu. Located in the heart of Bhaktapur, we are proud to be Nepal’s unique store dedicated exclusively to buying and selling gently used electronic devices. Since 2020, we have been empowering tech lovers across the country to embrace sustainability while enjoying affordable technology.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">What we do?</h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            At <span className="font-semibold text-blue-600">Electronic Thrift Store Nepal</span>, we believe that great technology shouldn’t come with a hefty price tag. Explore our wide range of carefully tested smartphones, laptops, cameras, tablets, and accessories — all available at unbeatable prices. Whether you’re upgrading your devices or looking to sell your electronics with confidence, our seamless <span className="font-semibold text-blue-600">Become a Seller</span> process makes it easy to join our growing community. Experience quality, reliability, and value — all under one roof.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Our Mission And Vision</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Mission</h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              At <span className="font-semibold text-blue-600">Electronic Thrift Store</span>, our mission is to bridge the gap between cutting-edge technology and affordability. We are committed to providing high-quality, pre-owned electronics that empower every Nepali to stay connected and thrive, while championing sustainability. Through transparency, trust, and exceptional customer service, we create a welcoming community where every device is given a second life—helping reduce e-waste and enrich lives across Nepal.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Vision</h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              We envision a future where sustainable technology is within everyone’s reach. As Nepal’s premier electronic thrift store, we strive to foster a culture of conscious consumption, where each purchase contributes to a greener, cleaner planet. By expanding our offerings and elevating our services, we aim to be the trusted destination for affordable, reliable electronics that inspire innovation and opportunity for generations ahead.
            </p>
          </div>
        </section>

        <p className="text-center italic text-lg text-blue-600 font-semibold mt-8">
          "Join us in making smarter, greener technology choices—because the future belongs to those who reuse, recycle, and renew."
        </p>
      </div>
    </div>
  );
}
