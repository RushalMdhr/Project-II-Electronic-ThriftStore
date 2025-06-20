import React from 'react'
import '../styles/ContactUs.css'
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
<section className='contact-form'>
    <form onSubmit={onSubmit}>
        <h2> Contact Form</h2>
        <div className='input-box'>
            <label> Full Name</label>
            <input type='text' name='name'className='field'placeholder='Enter your name' required/>
        </div>
        <div className='input-box'>
            <label> Email</label>
            <input type='email' name='email' className='field'placeholder='Enter your email' required/>
        </div>
        <div className='input-box'>
            <label> Your Message</label>
            <textarea name="message" id="" className="field mess"placeholder="Enter your message" required></textarea>
        </div>
        <button type="submit">Send Message</button>
    </form>
</section>
 )
 }
 export default ContactUs


