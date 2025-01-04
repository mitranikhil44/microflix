"use client";

import React, { useState, useEffect } from "react";
import { useWebStore } from "@/context";
import LoadingSpinner from "@/components/Loading";

function Contact() {
  const { setProgress } = useWebStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  useEffect(() => {
    setProgress(100);
  }, [setProgress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/postcontact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Success:", await response.json());
        setFormData({
          name: "",
          email: "",
          contact: "",
          message: "",
        });
        setIsSubmitted(true);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSubmitted(false), 5000); // Hide success message after 5 seconds
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Floating Success Message */}
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-600 text-white py-4 px-6 rounded-lg shadow-lg">
            <p>Your message has been successfully submitted! We’ll get back to you shortly.</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-gray-800 text-white rounded-lg shadow-lg p-8"
      >
        {isLoading && <LoadingSpinner />}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
          Feedback To Us!
        </h2>
        <p className="text-center mb-6 text-gray-300">
          Have any questions or want a quote? Fill out the form below, and our team will respond to you as soon as possible.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full p-3 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full p-3 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email address"
            />
          </div>
        </div>
        {/* Contact Field */}
        <div className="mt-6">
          <label htmlFor="contact" className="block text-sm font-medium">
            Contact Number <span className="text-sm">(optional)</span>
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            value={formData.contact}
            onChange={handleChange}
            className="mt-2 block w-full p-3 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your phone number"
          />
        </div>
        {/* Message Field */}
        <div className="mt-6">
          <label htmlFor="message" className="block text-sm font-medium">
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            className="mt-2 block w-full p-3 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Write your message here..."
          />
        </div>
        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Contact;
