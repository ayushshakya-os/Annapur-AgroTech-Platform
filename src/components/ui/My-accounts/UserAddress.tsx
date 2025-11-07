"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetAddresses } from "@/hooks/api/my-account/Address/useGetAddress";
import { useAddAddress } from "@/hooks/api/my-account/Address/useAddAddress";
import { useUpdateAddress } from "@/hooks/api/my-account/Address/useUpdateAddress";
import { useDeleteAddress } from "@/hooks/api/my-account/Address/useDeleteAddress";
import HeaderText from "@/components/HeaderText";

const initialForm = {
  label: "",
  address: "",
  city: "",
  state: "",
  isDefault: false,
};

export default function UserAddress() {
  const { user } = useAuth();
  const userId = user?.id || user?.id || "";

  const { data: addresses = [], isLoading } = useGetAddresses(userId);
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress.mutate({ userId, ...form });
    setForm(initialForm);
  };

  const handleEdit = (address: any) => {
    setEditId(address._id);
    setForm({
      label: address.label,
      address: address.address,
      city: address.city,
      state: address.state,
      isDefault: !!address.isDefault,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    updateAddress.mutate({ userId, addressId: editId, ...form });
    setEditId(null);
    setForm(initialForm);
  };

  const handleDelete = (addressId: string) => {
    deleteAddress.mutate({ userId, addressId });
  };

  return (
    <div>
      <HeaderText text="My Addresses" className="text-left mb-6" />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="mb-6">
          {addresses.map((addr: any) => (
            <li
              key={addr._id}
              className="mb-2 border rounded p-3 flex justify-between items-center"
            >
              <div>
                <div>
                  <b>{addr.label}</b>{" "}
                  {addr.isDefault && (
                    <span className="text-green-600 ml-2">(Default)</span>
                  )}
                </div>
                <div>
                  {addr.address}, {addr.city}, {addr.state}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-100 rounded"
                  onClick={() => handleEdit(addr)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-100 rounded"
                  onClick={() => handleDelete(addr._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={editId ? handleUpdate : handleAdd}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="label"
          placeholder="Label (e.g. Home, Work)"
          value={form.label}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <label className="flex items-center gap-2 col-span-full">
          <input
            name="isDefault"
            type="checkbox"
            checked={form.isDefault}
            onChange={handleChange}
          />
          Set as default
        </label>
        <button
          type="submit"
          className="col-span-full px-4 py-2 bg-green-600 text-white rounded"
        >
          {editId ? "Update Address" : "Add Address"}
        </button>
        {editId && (
          <button
            type="button"
            className="col-span-full px-4 py-2 bg-gray-300 rounded"
            onClick={() => {
              setEditId(null);
              setForm(initialForm);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}
