// import { useEffect, useState } from "react";
// import { set, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { getUserAddresses } from "@/hooks/api/myaccount/address/getAddress";
// import { postNewAddress } from "@/hooks/api/myaccount/address/postNewAddress";
// import { updateAddress } from "@/hooks/api/myaccount/address/updateAddress";
// import { deleteUserAddress } from "@/hooks/api/myaccount/address/deleteAddress";

// import { useGetCountries } from "@/hooks/api/utils/CountryList";
// import { useGetCities } from "@/hooks/api/utils/CityList";
// import { useGetStates } from "@/hooks/api/utils/StateList";
// import Image from "next/image";

// import { showToast } from "@/libs/toast";
// import {
//   TAddressFormSchema,
//   AddressFormSchema,
// } from "@/libs/validation/AddressForm/AddressFormSchema";
// import InputField from "../Accounts/InputField";
// import SelectField from "./SelectField";
// import CartButtons from "../Buttons/CartButtons";
// import { X } from "lucide-react";

// const UserAddress = () => {
//   const [addresses, setAddresses] = useState<any[]>([]);
//   const [editing, setEditing] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [showDeleteCancel, setShowDeleteCancel] = useState(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const handleDeleteAddress = () => {
//     setShowDeleteCancel(true);
//   };

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//     setValue,
//   } = useForm<TAddressFormSchema>({
//     resolver: zodResolver(AddressFormSchema),
//     mode: "onBlur",
//   });

//   const { data: countries = [] } = useGetCountries();
//   const { data: states = [], refetch: refetchStates } = useGetStates(
//     watch("country")
//   );
//   const { data: cities = [], refetch: refetchCities } = useGetCities(
//     watch("country"),
//     watch("state")
//   );

//   useEffect(() => {
//     (async () => {
//       const data = await getUserAddresses();
//       setAddresses(data?.results || []);
//     })();
//   }, []);

//   useEffect(() => {
//     if (watch("country")) {
//       refetchStates();
//       setValue("state", "");
//       setValue("city", "");
//     }
//   }, [watch("country")]);

//   useEffect(() => {
//     if (watch("state")) {
//       refetchCities();
//       setValue("city", "");
//     }
//   }, [watch("state")]);

//   const onSubmit = async (data: TAddressFormSchema) => {
//     try {
//       if (editing && editingId) {
//         await updateAddress(data, editingId);
//         showToast("success", "Updated address successfully");
//         setEditing(false);
//         setEditingId(null);
//         reset(
//           {
//             name: "",
//             email: "",
//             country: "",
//             state: "",
//             city: "",
//             postal_code: "",
//             address: "",
//             phone: "",
//           },
//           { keepDirty: false }
//         );
//       } else {
//         await postNewAddress(data);
//         showToast("success", "Added address successfully");
//       }
//       const refreshed = await getUserAddresses();
//       setAddresses(refreshed.results || []);
//       setEditing(false);
//       setEditingId(null);
//       reset();
//     } catch (error: any) {
//       showToast("error", "Failed to save address");
//     }
//   };

//   const onDelete = async (id: number) => {
//     try {
//       await deleteUserAddress(id);
//       setAddresses(addresses.filter((a) => a.id !== id));
//       showToast("success", "Address deleted successfully!");
//     } catch {
//       showToast("error", "Failed to delete address");
//     }
//   };

//   return (
//     <div className=" bg-white rounded-md">
//       <h2 className="text-2xl font-semibold mb-4">
//         {editing ? "Edit Address" : "Add New Address"}
//       </h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="">
//         <div className="flex flex-row gap-4 mb-4">
//           <InputField
//             labelText="Name"
//             type="text"
//             id="name"
//             {...register("name")}
//             placeholder="Name"
//             //   className="input"
//             error={errors.name?.message}
//           />
//           <InputField
//             labelText="Email"
//             type="email"
//             id="email"
//             {...register("email")}
//             placeholder="Email"
//             //   className="input"
//             error={errors.email?.message}
//           />
//         </div>
//         <div className="flex flex-row gap-4 mb-4">
//           <SelectField
//             id="country"
//             labelText="Country"
//             placeholder="Select a country"
//             error={errors.country?.message}
//             {...register("country")}
//             options={countries.map((c: any) => ({
//               value: c.id,
//               label: c.name,
//             }))}
//           />
//           <SelectField
//             id="state"
//             labelText="State"
//             placeholder="Select your state"
//             error={errors.state?.message}
//             {...register("state")}
//             options={states.map((s: any) => ({
//               value: s.id,
//               label: s.name,
//             }))}
//           />
//         </div>
//         <div className="flex flex-row gap-4 mb-4">
//           <SelectField
//             id="city"
//             labelText="City"
//             placeholder="Select your city"
//             error={errors.city?.message}
//             {...register("city")}
//             options={cities.map((c: any) => ({
//               value: c.id,
//               label: c.name,
//             }))}
//           />
//           <InputField
//             labelText="Postal Code"
//             type="text"
//             id="postal_code"
//             {...register("postal_code")}
//             placeholder="Postal Code"
//             //   className="input"
//             error={errors.postal_code?.message}
//           />
//         </div>
//         <div className="flex flex-row gap-4 mb-4">
//           <InputField
//             labelText="Address"
//             type="text"
//             id="address"
//             {...register("address")}
//             placeholder="Address"
//             //   className="input"
//           />
//           <InputField
//             labelText="Phone"
//             type="text"
//             id="phone"
//             {...register("phone")}
//             placeholder="Phone"
//             //   className="input"
//           />
//         </div>
//         <div className="col-span-full flex gap-4 mt-4">
//           <CartButtons
//             type="submit"
//             bgColor="bg-[#343434]"
//             textColor="text-white"
//             label={editing ? "Update Address" : "Add Address"}
//             className="hover:opacity-80 transition-opacity duration-200 ease-in-out"
//           />
//           <CartButtons
//             type="button"
//             bgColor="bg-white"
//             textColor="text-[#343434]"
//             label="Cancel"
//             className="hover:opacity-80 transition-opacity duration-200 ease-in-out"
//             onClick={() => {
//               setEditing(false);
//               setEditingId(null);
//               reset(
//                 {
//                   name: "",
//                   email: "",
//                   country: "",
//                   state: "",
//                   city: "",
//                   postal_code: "",
//                   address: "",
//                   phone: "",
//                 },
//                 { keepDirty: false }
//               );
//             }}
//           />
//         </div>
//       </form>
//       {showDeleteCancel && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-[5px] bg-opacity-30  transition duration-300 ease-in-out overflow-hidden">
//           <div className="relative flex flex-col justify-center items-center mt-4 mb-6 bg-white shadow-lg border border-gray-300 rounded p-5 w-[540px]">
//             <button
//               onClick={() => setShowDeleteCancel(false)}
//               className="relative bottom-2 left-60 flex text-right items-end justify-end rounded-full p-1 hover:bg-[#151515] hover:text-white transition duration-300 ease-in-out"
//             >
//               <X
//                 size={20}
//                 className="text-[#353535] hover:text-[white] transform transition duration-300 ease-in-out "
//               />
//             </button>
//             <div className="flex flex-col justify-center items-center text-center px-10 mb-5">
//               <div className="rounded-full bg-[#FFF8F8] p-3">
//                 <Image
//                   src="/images/logout.svg"
//                   alt="cancel"
//                   width={30}
//                   height={30}
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <h2 className="font-dm-sans font-medium text-[24px] text-[#565656]">
//                   Are you sure you want to delete this address?
//                 </h2>
//                 <p className="font-raleway font-normal text-[15px] text-[#969696]">
//                   This action cannot be undone.
//                 </p>
//               </div>
//             </div>
//             <div className="w-full flex justify-end gap-4">
//               <CartButtons
//                 label="GO BACK"
//                 bgColor="bg-white"
//                 textColor="text-[#343434]"
//                 className="w-full border-none shadow-none px-none"
//                 onClick={() => setShowDeleteCancel(false)}
//               />
//               <CartButtons
//                 label="DELETE"
//                 bgColor="bg-[#343434]"
//                 textColor="text-white"
//                 className="w-full border-none  shadow-none"
//                 onClick={() => {
//                   if (deleteId) {
//                     onDelete(deleteId);
//                     setShowDeleteCancel(false);
//                     setDeleteId(null); // Optional: clear deleteId after deletion
//                   }
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <h3 className="text-xl font-medium mt-8 mb-2">Address Book</h3>
//       <div className="space-y-4">
//         {addresses.length === 0 && (
//           <p className="text-gray-500">No addresses found.</p>
//         )}
//         {addresses.map((addr) => (
//           <div key={addr.id} className="p-4 rounded-md bg-[#F7F7F7]">
//             <div className="flex justify-between">
//               <div>
//                 <p className="font-semibold">{addr.name}</p>
//                 <p>{addr.email}</p>
//                 <p>{addr.phone}</p>
//                 <p>
//                   {addr.address}, {addr.city?.name}, {addr.state?.name},{" "}
//                   {addr.country?.name} {addr.postal_code}
//                 </p>
//               </div>
//               <div className="flex flex-col justify-center items-end gap-2">
//                 <CartButtons
//                   onClick={() => {
//                     reset({
//                       name: addr.name,
//                       email: addr.email,
//                       country: String(addr.country?.id),
//                       state: String(addr.state?.id),
//                       city: String(addr.city?.id),
//                       postal_code: String(addr.postal_code),
//                       address: addr.address,
//                       phone: String(addr.phone),
//                     });
//                     setEditing(true);
//                     setEditingId(addr.id);
//                   }}
//                   bgColor="bg-[#343434]"
//                   textColor="text-white"
//                   label="Edit"
//                   className="hover:opacity-80 transition-opacity duration-200 ease-in-out w-full"
//                 />

//                 <CartButtons
//                   onClick={() => {
//                     setDeleteId(addr.id);
//                     handleDeleteAddress();
//                   }}
//                   bgColor="bg-red-500"
//                   textColor="text-white"
//                   label="Delete"
//                   className="hover:opacity-80 transition-opacity duration-200 ease-in-out w-full"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserAddress;
