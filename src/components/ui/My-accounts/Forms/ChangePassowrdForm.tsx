"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  TChangePasswordData,
  ChangePasswordSchema,
} from "../../../../lib/validation/ChangePassword/ChangePasswordSchema";
// import { useChangePassword } from "../../../../hooks/api/accounts/changePassword";
import TextInput from "@/components/TextInput";

const ChangePasswordForm = () => {
  const router = useRouter();
  // const { mutate, isSuccess } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<TChangePasswordData> = async (
    data: TChangePasswordData
  ) => {
    console.log("Change Password Data:", data);
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     reset();
  //     router.refresh();
  //   }
  // }, [isSuccess, router]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-lg w-full"
    >
      <div>
        <TextInput
          type="password"
          label="Current Password"
          id="current_password"
          {...register("old_password")}
          placeholder="Enter Current Password"
          error={errors.old_password?.message}
        />
      </div>

      <div>
        <TextInput
          type="password"
          label="New Password"
          id="new_password"
          {...register("new_password")}
          placeholder="Enter New Password"
          error={errors.new_password?.message}
        />
      </div>

      <div>
        <TextInput
          type="password"
          label="Confirm New Password"
          id="new_password2"
          {...register("confirm_password")}
          placeholder="Confirm New Password"
          error={errors.confirm_password?.message}
        />
      </div>

      <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
        <li>The length of password should be 8 - 20 characters.</li>
        <li>
          Password should contain letters, numbers, and special characters.
        </li>
        <li>Password can only include ~.!@#$%^&* symbols.</li>
      </ul>

      <button
        type="submit"
        className="w-[200px] text-[14px] text-left px-4 py-2 mt-4 cursor-pointer bg-[#88B04B] text-white rounded-md hover:bg-green-600 transform ease-in-out duration-300"
      >
        Change Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;
