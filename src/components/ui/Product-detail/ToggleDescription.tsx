"use client";

import { useState } from "react";
import reviewsData from "@/data/product-reviews.json";
import { FaStar } from "react-icons/fa";

const tabs = ["Details", "Reviews", "Shipping"];

interface ToggleDescriptionProps {
  product: {
    id: number;
    description?: string;
  };
}

export default function ToggleDescription({ product }: ToggleDescriptionProps) {
  const [activeTab, setActiveTab] = useState("Details");

  const productReviews =
    reviewsData.find((review) => Number(review.productId) === product.id)
      ?.reviews ?? [];

  return (
    <div className="mt-3">
      <div className="flex justify-center gap-6 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-9 py-2 mb-4 rounded-full font-semibold text-base transition-colors duration-200 ${
              activeTab === tab
                ? "bg-[#88B04B] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-8 text-base mb-4 text-gray-800 max-w-4xl mx-auto shadow-sm">
        {activeTab === "Details" && (
          <p>
            {product.description?.trim()
              ? product.description
              : "No additional details available for this product at the moment."}
          </p>
        )}
        {activeTab === "Reviews" && (
          <div>
            <p className="font-semibold mb-4 text-lg">Customer Reviews:</p>
            {productReviews?.length ? (
              <ul className="space-y-6">
                {productReviews.map((review, index) => (
                  <li key={index} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{review.name}</span>
                      {review.verified && (
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 mr-1 ${
                            i < review.rating
                              ? "text-[#88B04B]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews available for this product.</p>
            )}
          </div>
        )}

        {activeTab === "Shipping" && (
          <div>
            <p>
              Shipping and delivery are managed directly by the farmers or
              vendors who list their products on our platform. Delivery times,
              methods, and costs may vary depending on the seller and your
              location.
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-700">
              <li>
                Each farmer is responsible for coordinating delivery with the
                customer or vendor.
              </li>
              <li>
                We recommend contacting the seller directly for specific
                delivery details.
              </li>
              <li>
                Our platform does not currently offer centralized shipping or
                logistics services.
              </li>
              <li>
                For any issues or concerns, feel free to reach out to our
                support team.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
