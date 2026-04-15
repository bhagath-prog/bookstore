"use client";

export default function ProfilePage() {
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : "";

  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : "";

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Profile</h1>
      <p><b>Name:</b> {userName}</p>
      <p><b>Email:</b> {userEmail}</p>
    </div>
  );
}
