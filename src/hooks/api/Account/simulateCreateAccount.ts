// simulateCreateUser.ts
export function simulateCreateUser(userData: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

  const userExists = existingUsers.some(
    (user: any) =>
      user.email === userData.email || user.phone === userData.phone
  );

  if (userExists) {
    return { success: false, message: "User already exists" };
  }

  const newUser = {
    ...userData,
    id: Date.now(),
  };

  localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

  return { success: true };
}
