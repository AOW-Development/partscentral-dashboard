//create a login page for the partscentral dashboard
"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import useAuthStore from "@/store/auth";
import { URL } from "@/utils//imageUrl";
import { Eye, EyeClosed } from "lucide-react";
// import { Exo } from "next/font/google";
// const exo = Exo({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const validate = () => {
    if (!email) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      // Dummy API call
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setSuccess("Login successful (dummy API)");
        login({ email, id: "dummy-id" }, "dummy-token");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError("Invalid credentials (dummy API)");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main text-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-6 bg-secondary flex items-center justify-start shadow-md">
        {/* <h2 className="text-xl font-bold tracking-wide">Login</h2> */}
        <Image
          src={`${URL}header-3.png`}
          alt="Logo"
          width={200}
          height={60}
          className="w-[160px] h-[28px] md:w-[200px] md:h-[30px]"
        />
      </header>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center border border-gray-700 rounded-lg bg-secondary px-5 py-10 md:py-15 md:px-20 w-full md:w-1/3 mx-auto mt-10">
          <h1 className="text-3xl font-bold mb-6 font-audiowide">
            Admin Login
          </h1>
          <form
            className="w-full max-w-sm space-y-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border border-blue-300 rounded-lg px-4 py-2 w-full text-white placeholder-gray-400 focus:outline-none"
              autoComplete="username"
              disabled={loading}
            />
            {/* <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border border-blue-300 rounded-lg px-4 py-2 w-full text-white placeholder-gray-400 focus:outline-none"
              autoComplete="current-password"
              disabled={loading}
            /> */}
            {/* // Password visibility toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary border border-blue-300 rounded-lg px-4 py-2 w-full text-white placeholder-gray-400 focus:outline-none"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && (
              <div className="text-red-400 text-sm font-medium">{error}</div>
            )}
            {success && (
              <div className="text-green-400 text-sm font-medium">
                {success}
              </div>
            )}
            <button
              type="submit"
              className="bg-hover cursor-pointer hover:bg-[#0075ff] w-full py-2 rounded-lg text-white font-semibold  transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-10 px-6 bg-secondary text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} PartsCentral Dashboard. All rights
        reserved.
      </footer>
    </div>
  );
}
