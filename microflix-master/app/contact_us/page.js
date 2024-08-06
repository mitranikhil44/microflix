"use client"

import React, { useState, useEffect } from "react";
import { useWebStore } from "@/context";
import LoadingSpinner from "@/components/Loading";

function Contact() {  
  const { setProgress } = useWebStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  useEffect(() => {
    setProgress(100)
  }, [])
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/postcontact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        timeout: 15000, cache: "reload"
      });

      if (response.ok) {
        console.log("Success:", await response.json());
        setFormData({
          name: "",
          email: "",
          contact: "",
          message: "",
        });
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
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
    <form onSubmit={handleSubmit} className="border rounded-lg w-full flex items-center justify-center my-12">
      {isLoading && <LoadingSpinner />}
      <div className="shadow rounded py-12 lg:px-28 px-8">
        <p className="md:text-3xl text-xl font-bold leading-7 text-center text-gray-100">Let’s chat and get a quote!</p>
        <div className="md:flex items-center mt-12">
          <div className="md:w-72 flex flex-col">
            <label htmlFor="name" className="text-base font-semibold leading-none text-gray-100">Name <span className="text-red-600">*</span></label>
            <input
              id="name"
              name="name"
              type="name"
              value={formData.name}
              onChange={handleChange}
              className="text-base leading-none text-gray-900 p-3 focus:outline-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200"
            />
          </div>
          <div className="md:w-72 flex flex-col md:ml-6 md:mt-0 mt-4">
            <label htmlFor="email" className="text-base font-semibold leading-none text-gray-100">Email Address <span className="text-red-600">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="text-base leading-none text-gray-900 p-3 focus:outline-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
            />
          </div>
        </div>
        <div className="md:flex items-center mt-8">
          <div className="md:w-72 flex flex-col">
            <label htmlFor="contact" className="text-base font-semibold leading-none text-gray-100">Contact No. <span className="text-sm">(optional)</span></label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange}
              className="text-base leading-none text-gray-900 p-3 focus:outline-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
            />
          </div>
        </div>
        <div>
          <div className="w-full flex flex-col mt-8">
            <label htmlFor='message' className="text-base font-semibold leading-none text-gray-100">Message <span className="text-red-600">*</span></label>
            <textarea
              id="message"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={handleChange}
              className="h-36 text-base leading-none text-gray-900 p-3 focus:outline-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100 resize-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          <button
            type="submit"
            className="mt-9 text-base font-semibold leading-none text-white py-4 px-10 bg-indigo-700 rounded hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </form>
  );
}

export default Contact;
