"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="mb-6 w-16 h-16 rounded-full bg-green-900/40 border border-green-700/40 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-3">
          Message received
        </h2>
        <p className="text-gray-400 max-w-sm">
          Thanks for reaching out. We&#39;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Get in touch</h1>
        <p className="text-gray-400">
          Have a question or want to place a large order? We&#39;d love to hear
          from you.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5">
        <Input
          label="Your Name"
          id="name"
          placeholder="e.g. John Smith"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            value={form.message}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, message: e.target.value }))
            }
            rows={5}
            placeholder="Write your message here..."
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3.5 py-2.5 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
            required
          />
        </div>
        <Button
          className="w-full mt-2"
          size="lg"
          onClick={() => {
            if (form.name && form.message) setSubmitted(true);
          }}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}
