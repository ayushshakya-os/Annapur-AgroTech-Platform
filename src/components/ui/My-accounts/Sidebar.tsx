"use client";

import { FiUser, FiKey } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import clsx from "clsx";
import { FaBell } from "react-icons/fa";

type Props = {
  activeTab: string;
  setActiveTab: (key: string) => void;
};

const tabs = [
  { key: "account", icon: <FiUser />, label: "My Account" },
  { key: "address", icon: <GrLocation />, label: "Address" },
  { key: "password", icon: <FiKey />, label: "Change Password" },
  { key: "notifications", icon: <FaBell />, label: "Notification History" },
];

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  return (
    <div className="w-full h-fit md:w-1/4 bg-white shadow rounded-none py-2">
      <ul className="flex flex-col space-y-2">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <button
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "flex items-center w-full px-4 py-2 rounded-none text-left gap-2 transition-colors duration-500",
                activeTab === tab.key
                  ? "bg-gray-200 border-l-4 border-[#88B04B] font-semibold"
                  : "hover:bg-gray-100"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
