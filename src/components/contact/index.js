import React from 'react';

function ContactUs() {
  return (
    <div className="w-full px-6 py-10 text-left">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">Snackblitz welcomes your questions, comments, and feedback. Our customer support team is here to assist you with any inquiries you may have regarding our services. You can reach us using the following contact information:</p>
      <div className="mb-4">
        <p><strong>Email:</strong> <a href="mailto:Snackblitz7@gmail.com" className="text-blue-600">Snackblitz7@gmail.com</a></p>
        <p><strong>Phone:</strong> <a href="tel:8439863975" className="text-blue-600">8439863975</a></p>
        <p><strong>Address:</strong> Phase 2 Amayra Greens, Aujala Kharar, Punjab 140301</p>
      </div>
      <p className="mb-4">Our customer support team can assist you from 8:00 am to 10:00 pm. Please feel free to reach out to us via email or phone, and we will respond to your inquiry as soon as possible.</p>
      <p>Thank you for choosing Snackblitz. We look forward to serving you!</p>
    </div>
  );
}

export default ContactUs;
