"use client";

import { useState, useMemo } from "react";
import { LoginButton } from "@/components/ui/Buttons/LoginButton";
import HeaderText from "@/components/HeaderText";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaSeedling, FaUserTie } from "react-icons/fa";
import TextInput from "@/components/TextInput";
import PasswordInput from "@/components/PasswordInput";
import TermsAndPrivacyModal from "@/components/TermsAndPrivacy";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountSchema } from "@/lib/validation/CreateAccount/CreateAccountSchema";
import { simulateCreateUser } from "@/hooks/api/Account/simulateCreateAccount";
import { showAuthToast } from "../../Toasts/ToastMessage";
import { useRouter } from "next/navigation";

type CreateAccountForm = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  termsChecked: true;
};

const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  return score;
};

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
    mode: "onBlur",
  });

  const password = watch("password");
  const passwordStrength = useMemo(
    () => checkPasswordStrength(password || ""),
    [password]
  );

  const onSubmit = (data: CreateAccountForm) => {
    console.log("Form submitted with data:", data);
    const result = simulateCreateUser({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
    });

    if (result.success) {
      showAuthToast("signup");
      // Clear form fields after successful signup
      setValue("fullName", "");
      setValue("email", "");
      setValue("phone", "");
      setValue("password", "");
      setValue("confirmPassword", "");
      setValue("termsChecked", true);
      // Optionally redirect to login or home page
      router.push("/login");
    } else {
      showAuthToast("error");
    }
  };

  const handleUserTypeSelect = (type: "farmer" | "buyer") => {
    setValue("role", type, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex ">
      {/* Left Side - Full Image Section with Overlay Text */}
      <div className="hidden lg:flex w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/image/explore-image-1.jpg')" }}
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
        <div className="w-full max-w-md ">
          {/* Auth Navigation */}
          <div className="flex gap-4 mb-8 justify-between">
            <Link
              href="/login"
              className={`flex-1 text-2xl font-medium text-center transition-all border-b-2 pb-1 ${
                false
                  ? "text-[#88B04B] border-[#88B04B]"
                  : "text-gray-400 border-transparent hover:text-[#88B04B]"
              }`}
            >
              Login
            </Link>
            <Link
              href="/create-account"
              className="flex-1 text-2xl font-semibold text-center text-[#88B04B] border-b-2 border-[#88B04B] pb-1"
            >
              Create Account
            </Link>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">I am a</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleUserTypeSelect("farmer")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative overflow-hidden
                                    ${
                                      watch("role") === "farmer"
                                        ? "border-[#88B04B] bg-[#88B04B]/10"
                                        : "border-gray-200 hover:border-[#88B04B]/50"
                                    }`}
                style={{
                  backgroundImage: "url('/image/banner/banner-bg.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <FaSeedling
                  className={`w-8 h-8 ${
                    watch("role") === "farmer"
                      ? "text-[#88B04B]"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    watch("role") === "farmer"
                      ? "text-[#88B04B]"
                      : "text-gray-600"
                  }`}
                >
                  Farmer
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleUserTypeSelect("buyer")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative overflow-hidden
                                    ${
                                      watch("role") === "buyer"
                                        ? "border-[#88B04B] bg-[#88B04B]/10"
                                        : "border-gray-200 hover:border-[#88B04B]/50"
                                    }`}
                style={{
                  backgroundImage: "url('/image/banner/banner-bg.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <FaUserTie
                  className={`w-8 h-8 ${
                    watch("role") === "buyer"
                      ? "text-[#88B04B]"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    watch("role") === "buyer"
                      ? "text-[#88B04B]"
                      : "text-gray-600"
                  }`}
                >
                  Buyer
                </span>
              </button>
            </div>
          </div>

          {/* Signup Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Full Name"
              placeholder="Full Name"
              {...register("fullName")}
              error={errors.fullName?.message}
            />

            <div className="flex gap-4">
              <div className="w-1/2">
                <TextInput
                  label="E-mail"
                  {...register("email")}
                  placeholder="E-mail"
                  error={errors.email?.message}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  label="Phone Number"
                  {...register("phone")}
                  placeholder="Phone Number"
                  error={errors.phone?.message}
                />
              </div>
            </div>

            <PasswordInput
              label="Password"
              {...register("password")}
              placeholder="Create a password"
              error={errors.password?.message}
              passwordStrength={passwordStrength}
              showStrength={true}
              // toggleShow={() => setShowPassword((v) => !v)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 pr-10 focus:border-[#88B04B] focus:ring-2 focus:ring-[#88B04B]/50 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex flex-col items-start gap-2 text-sm text-gray-600">
              <div className="flex flex-row gap-3 items-start">
                <input
                  type="checkbox"
                  {...register("termsChecked")}
                  className="mt-1 accent-[#88B04B]"
                />
                <label>
                  Please read and accept the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-medium text-[#88B04B] cursor-pointer hover:underline"
                  >
                    TERMS AND CONDITIONS
                  </button>{" "}
                  and
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-medium text-[#88B04B] cursor-pointer hover:underline"
                  >
                    PRIVACY POLICY
                  </button>{" "}
                  to continue.
                </label>
              </div>
              {errors.termsChecked && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.termsChecked.message}
                </p>
              )}
            </div>

            <LoginButton
              variant="primary"
              type="submit"
              label="Create Account"
              className="w-full py-3 text-lg font-semibold bg-[#88B04B] hover:bg-[#78a03f]"
            />

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#88B04B] hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <TermsAndPrivacyModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </div>
  );
}
