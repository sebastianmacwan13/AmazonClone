import React, { useState, useRef } from 'react';


const Contactform = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: 'Sending...' });

    const formData = new FormData(formRef.current);

    try {
      const response = await fetch(`${API_BASE_URL}/api/send_mail`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const submissionId = result.submissionId;

        setStatus({
          type: 'success',
          message: (
            <>
              ✅ Message sent successfully!
              <a
                href={`${API_BASE_URL}/view_submission?id=${submissionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline"
              >
                View/Edit Submission
              </a>
            </>
          )
        });

        formRef.current.reset();
      } else {
        const errorText = await response.text();
        setStatus({ type: 'error', message: `❌ Failed: ${errorText}` });
      }
    } catch (err) {
       console.error("Form submission error:", err);
      setStatus({ type: 'error', message: '❌ Network error. Please try again.' });
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r  flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-4xl font-bold text-shadow-gray-700">Contact Us</h1>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
          encType="multipart/form-data"
        >
          <label htmlFor="name" className="block mb-2 font-bold text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Your Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded dark:text-black"
          />

          <label htmlFor="email" className="block mb-2 font-bold text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Your Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded dark:text-black"
          />

          <label htmlFor="subject" className="block mb-2 font-bold text-gray-700">Subject:</label>
          <input
            type="text"
            name="subject"
            id="subject"
            required
            placeholder="Message Subject"
            className="w-full p-2 mb-4 border border-gray-300 rounded dark:text-black"
          />

          <label htmlFor="message" className="block mb-2 font-bold text-gray-700">Message:</label>
          <textarea
            name="message"
            id="message"
            required
            placeholder="Your Message"
            className="w-full p-2 mb-4 border border-gray-300 rounded h-24 dark:text-black"
          ></textarea>

          <label htmlFor="attachment" className=" font-bold text-gray-700 border-2">
            Attachment (optional):
          </label>
          <input
            type="file"
            name="attachment"
            id="attachment"
            accept=".pdf,.doc,.docx,image/*"
            className="mb-4 dark:text-black"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>

          {status.message && (
            <div
              className={`mt-4 font-bold p-2 rounded text-center ${status.type === 'success'
                ? 'text-green-700 bg-green-100 border border-green-700'
                : 'text-red-700 bg-red-100 border border-red-700'
                }`}
            >
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>

  );
};

export default Contactform;

