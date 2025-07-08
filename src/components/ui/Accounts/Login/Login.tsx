"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginSchemaType,
} from "@/lib/validation/LoginForm/LoginFormSchema";
import { useRouter } from "next/navigation";
import { LoginButton } from "@/components/ui/Buttons/LoginButton";
import HeaderText from "@/components/HeaderText";
import Link from "next/link";
import TextInput from "@/components/TextInput";
import PasswordInput from "@/components/PasswordInput";
import CheckboxInput from "@/components/CheckboxInput";
import { showAuthToast } from "../../Toasts/ToastMessage";
import { simulateUserLogin } from "@/hooks/api/Account/simulateUserLogin";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();

  const onSubmit = (data: LoginSchemaType) => {
    console.log("Login submitted with data:", data);

    const { email, password } = data;
    const result = simulateUserLogin({ email, password });

    if (result.success) {
      showAuthToast("login");
      router.push("/");
    } else {
      showAuthToast("error");
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/image/explore-image.jpg')" }}
        ></div>

        <div className="relative z-10 max-w-2xl text-center m-auto p-12 bg-black/40 rounded-lg">
          <HeaderText
            text="Welcome to Annapur"
            text2="The marketplace connecting Nepali farmers directly with buyers"
            className="mb-8 text-white"
          />
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Auth Navigation */}
          <div className="flex gap-4 mv-8 justify-between">
            <Link
              href="/login"
              className="flex-1 text-2xl font-semibold text-center text-[#88B04B] border-b-2 border-[#88B04B] pb-1"
            >
              Login
            </Link>
            <Link
              href="/create-account"
              className={`flex-1 text-2xl font-medium text-center transition-all border-b-2 pb-1 ${
                false
                  ? "text-[#88B04B] border-[#88B04B]"
                  : "text-gray-400 border-transparent hover:text-[#88B04B]"
              }`}
            >
              Create Account
            </Link>
          </div>

          {/* Login Form */}
          <form className="space-y-5 mt-10" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Email or Phone Number"
              {...register("email")}
              placeholder="Enter email or phone"
              error={errors.email?.message}
            />

            <PasswordInput
              label="Password"
              {...register("password")}
              placeholder="Enter your password"
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <CheckboxInput
                label="Remember me"
                name="rememberMe"
                checked={watch("rememberMe") || false}
                onChange={(e) => setValue("rememberMe", e.target.checked)}
              />

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-accent hover:underline text-[#88B04B]"
              >
                Forgot password?
              </Link>
            </div>

            <LoginButton
              variant="primary"
              type="submit"
              label="Login"
              className="w-full py-3 text-lg font-semibold bg-[#88B04B] hover:bg=[#78a03f]"
            />

            <p className=" text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/create-account"
                className="text-sm font-medium text-accent hover:underline text-[#88B04B]"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
