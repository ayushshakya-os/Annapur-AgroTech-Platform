// "use client";

// import React, { useState } from "react";
// import { AiOutlineArrowLeft } from "react-icons/ai";
// import { useGetUserProfile } from "@/hooks/api/user/getProfile";
// import CartButtons from "../Buttons/CartButtons";
// import UserDetailEdit from "./Forms/UserDetailEdit";
// import { ChevronLast, ChevronLeft } from "lucide-react";

// const UserInfo = () => {
//   const [activeForm, setActiveForm] = useState("myAccount");
//   const handleEditUser = () => setActiveForm("editUser");
//   const handleBack = () => setActiveForm("myAccount");
//   const { data: user } = useGetUserProfile();

//   return (
//     <>
//       {activeForm === "myAccount" && (
//         <div className="space-y-2">
//           <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
//             My Account
//           </h2>

//           <p className="text-gray-700 font-semibold">Contact Information</p>
//           <p className="text-gray-800">
//             {user?.first_name} {user?.last_name}
//           </p>
//           <p className="text-gray-800">{user?.email}</p>
//           <p className="text-gray-800">{user?.phone}</p>

//           <CartButtons
//             label="Edit User"
//             onClick={handleEditUser}
//             bgColor="bg-[#343434]"
//             textColor="text-white"
//             className="w-[200px] mt-4 cursor-pointer"
//           />
//         </div>
//       )}

//       {activeForm === "editUser" && (
//         <div className="relative">
//           <UserDetailEdit />

//           <CartButtons
//             label="Back"
//             onClick={handleBack}
//             bgColor="bg-[#343434]"
//             textColor="text-white"
//             className="w-[200px] mt-4 cursor-pointer flex items-center gap-2"
//             icon={<ChevronLeft size={16} />}
//             iconPosition="left"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default UserInfo;
