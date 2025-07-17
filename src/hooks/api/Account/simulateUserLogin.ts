// simulateUserLogin.ts
export function simulateUserLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find(
    (u: any) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  const token = `user_${crypto.randomUUID()}`;

  const authData = {
    token,
    email: user.email,
    firstName: user.fullName.split(" ")[0],
    lastName: user.fullName.split(" ").slice(1).join(" ") || "",
    username: user.email.split("@")[0],
    role: user.role || "buyer",
  };

  localStorage.setItem("auth", JSON.stringify(authData));

  return { success: true, data: authData };
}
