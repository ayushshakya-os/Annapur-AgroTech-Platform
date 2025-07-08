// simulateGuestLogin.ts
export function simulateGuestLogin() {
  const token = `guest_${crypto.randomUUID()}`;
  const guestData = {
    token,
    email: "",
    firstName: "Guest",
    lastName: "",
    username: "guest",
    isGuest: true,
  };
  localStorage.setItem("auth", JSON.stringify(guestData));
  return guestData;
}
