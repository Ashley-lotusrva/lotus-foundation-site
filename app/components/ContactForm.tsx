"use client";

import { useState } from "react";

const CONTACT_EMAIL = "ashley.thompson@lotusfoundation.info";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `New inquiry from ${form.name || "website visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground/80">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="mt-1.5 w-full rounded-lg border border-royal-purple/20 px-4 py-2.5 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="mt-1.5 w-full rounded-lg border border-royal-purple/20 px-4 py-2.5 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground/80">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={handleChange}
          className="mt-1.5 w-full rounded-lg border border-royal-purple/20 px-4 py-2.5 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-royal-purple px-6 py-3 text-white font-medium hover:bg-teal transition-colors"
      >
        Send Message
      </button>
      {sent && (
        <p className="text-sm text-emerald-green text-center">
          Your email app should now be open with your message ready to send.
        </p>
      )}
    </form>
  );
}
