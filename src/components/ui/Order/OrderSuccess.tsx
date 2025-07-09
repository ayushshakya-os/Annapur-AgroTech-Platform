"use client";

import React from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../Buttons/Button";
import FeaturedProducts from "./FeaturedSection";
import {
  useRouter,
  useSearchParams,
} from "next/dist/client/components/navigation";
export default function OrderSucess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  return (
    <section className="flex flex-col pt-16 mt-10 justify-center items-center w-full">
      <div>
        {/* Check icon and order details text */}
        <div className="flex flex-col justify-center items-center text-center">
          <div>
            <FaCheckCircle className="text-[#88B04B] text-6xl" />
          </div>
          <div>
            <h2 className="text-[24px] text-[#343434] font-dm-sans font-medium tracking-[0.1em] ">
              Order Placed Successfully!
            </h2>
            <p className="text-[16px] text-[#757575] font-dm-sans font-normal tracking-[0.04em]">
              Thank you for your order. Your order number is #123456.
            </p>
          </div>
        </div>

        {/* Order Redirection Buttons */}
        <div className="flex flex-row justify-center items-center pt-5">
          <Button
            text="VIEW ORDER DETAILS"
            onClick={() => {
              router.push(`/order-details/${orderId}`);
            }}
            className="bg-[#88B04B] text-white hover:bg-[#FFFFFF] hover:text-[#88B04B] border border-[#88B04B] transition-colors duration-300"
          />

          <Link href="/" className="flex flex-row items-center ml-4">
            <Button
              text="BACK TO HOMEPAGE"
              className="bg-[#FFFFFF] text-[#88B04B] hover:bg-[#88B04B] hover:text-[#FFFFFF] border border-[#88B04B] transition-colors duration-300"
            />
          </Link>
        </div>
      </div>

      <div className="bg-[#F1F1F1] my-20 w-full">
        <FeaturedProducts />
      </div>
    </section>
  );
}
