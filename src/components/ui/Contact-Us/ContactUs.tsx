"use client";
import { useState } from "react";
import HeaderText from "@/components/HeaderText";
import TextInput from "@/components/TextInput";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  ContactFormData,
} from "@/lib/validation/ContactUsForm/contactSchema";
import { showToast } from "../Toasts/toast";

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    showToast("success", "Message sent successfully!");
    reset();
  };
  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center flex flex-col items-center"
      style={{
        // backgroundImage: "url('/image/banner/banner-bg.png')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 w-lg max-w-xl space-y-4"
      >
        <div className="mb-6">
          <HeaderText
            text="Get in Touch"
            text2="Ask Us a Question"
            className=" text-center"
          />
        </div>
        <TextInput
          label="Name *"
          placeholder="Your Name"
          {...register("name")}
          error={errors.name?.message}
        />
        <TextInput
          label="Email *"
          placeholder="Your Email"
          {...register("email")}
          error={errors.email?.message}
        />
        <TextInput
          label="Phone *"
          placeholder="Your Phone"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <TextInput
          label="Subject *"
          placeholder="Your Subject"
          {...register("subject")}
          error={errors.subject?.message}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          {...register("message")}
          placeholder="Your Message"
          className="w-full border border-gray-300 p-3 rounded h-32 resize-none mb-0 focus:outline-none focus:border-[#88B04B] focus:ring-2 focus:ring-[#88B04B]/50"
        />
        {errors.message && (
          <p className="text-red-500 text-sm ">{errors.message.message}</p>
        )}
        <button
          type="submit"
          className="bg-[#88B04B] hover:bg-[#769740] text-white font-semibold py-2 px-6 mt-4 rounded-sm"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
