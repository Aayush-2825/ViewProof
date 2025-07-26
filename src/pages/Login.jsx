import { useState } from "react";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, Navigate, useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSucess] = useState("");
  const navigate = useNavigate();


  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setSucess("");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setSucess(
          "Verification email sent! Please verify your email to continue."
        );
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.message
          .replace(/Firebase:|auth\//g, "")
          .replace(/-/g, " ")
          .trim()
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-slate-200 px-4">
      <form
        onSubmit={handleSignin}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700">
          Login
        </h2>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-5 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter your email"
        />

        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-5 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition"
        >
          Login
        </button>
        {error && (
          <div className="mt-4 text-center text-red-600 font-medium bg-red-50 rounded p-2 border border-red-200 shadow">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-center text-green-600 font-medium bg-green-50 rounded p-2 border border-green-200 shadow">
            {success}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link
            to={"/signup"}
            className="text-blue-600 hover:underline font-semibold"
          >
            Don't have an account? <span className="underline">Sign Up</span>
          </Link>
        </div>
        <Link
          to="/reset-password"
          className="text-sm text-blue-500 hover:underline mt-2 block text-right"
        >
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
