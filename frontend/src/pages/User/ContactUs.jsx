import React from 'react'

import Swal from 'sweetalert2'
const ContactUs = () => { 
        
    const onSubmit = async (event) => {
        
        
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append("access_key", "a1715e4c-5696-402c-a237-2ed42fb757f4");

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: json
        }).then((res) => res.json());

        if (res.success) {
            Swal.fire({
                title:"Success!",
                text:"Message sent successfully",
                icon:"success"
            })
        }
    };

return (
  <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 py-12 px-2">
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-green-200 p-8 flex flex-col gap-6 animate-fade-in"
    >
      <h2 className="text-3xl font-extrabold text-green-700 mb-2 text-center tracking-tight">
        Contact Us
      </h2>
      <p className="text-center text-gray-500 mb-4">
        We'd love to hear from you! Fill out the form below and we'll get back to you soon.
      </p>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 shadow-sm transition"
          placeholder="Enter your name"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 shadow-sm transition"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 shadow-sm transition min-h-[100px] resize-y"
          placeholder="Enter your message"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition text-lg mt-2"
      >
        Send Message
      </button>
    </form>
  </section>
);
}
export default ContactUs;