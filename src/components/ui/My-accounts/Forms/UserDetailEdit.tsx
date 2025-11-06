"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProfile } from "@/hooks/api/my-account/useGetProfile";
import { useEditProfile } from "@/hooks/api/my-account/useEditProfile";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  TUserProfile,
  UserProfileSchema,
} from "@/lib/validation/userProfileSchema";
import { usePathname, useRouter } from "next/navigation";
import TextInput from "@/components/TextInput";

const UserDetailEdit = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { user } = useAuth();
  const { data: userData } = useGetProfile();
  const userId = user?.id || "";
  const { mutate: editProfile, isSuccess: isPatchSuccess } = useEditProfile();

  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TUserProfile>({
    mode: "onBlur",
    resolver: zodResolver(UserProfileSchema),
  });

  useEffect(() => {
    if (userData) {
      setValue("email", userData.email || "");
      setValue("phone", userData.phone || "");
      setValue("firstName", userData.firstName || "");
      setValue("lastName", userData.lastName || "");
    }
  }, [userData, setValue]);

  const onFormSubmit = (profileData: TUserProfile) => {
    const formData = new FormData();
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    formData.append("firstName", profileData.firstName);
    formData.append("lastName", profileData.lastName);
    setIsSubmitted(true);
    editProfile({
      id: userId,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
      email: profileData.email,
    });
  };

  useEffect(() => {
    if (isPatchSuccess && isSubmitted) {
      if (pathname === "/my-account") {
        window.location.reload();
      } else {
        router.push("/my-account");
      }
    }
  }, [isPatchSuccess, isSubmitted, pathname, router]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 border-b pb-2">
        Edit Account Details
      </h2>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <TextInput
            label="First Name"
            placeholder="John"
            id="firstName"
            type="text"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
        </div>

        <div>
          <TextInput
            label="Last Name"
            placeholder="Doe"
            id="lastName"
            type="text"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <div>
          <TextInput
            label="Phone"
            placeholder="(55) 12345-6789"
            id="phone"
            type="text"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        <div>
          <TextInput
            label="Email"
            placeholder="gT6y2@example.com"
            id="email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        <div className="flex flex-row gap-4 text-right mt-4">
          <button
            type="submit"
            className="w-[200px] text-[14px] text-left px-4 py-2 mt-4 cursor-pointer bg-[#88B04B] text-white rounded-md hover:bg-green-600 transform ease-in-out duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailEdit;
