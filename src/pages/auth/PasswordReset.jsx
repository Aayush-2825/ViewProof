import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSucess] = useState("");
  const handlePasswordReset = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");
    setSucess("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSucess("Password reset email sent");
    } catch (error) {
      setError(error.message.replace(/Firebase:|auth\/|-/g, " ").trim());
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-slate-200 px-4">
      <form
        onSubmit={handlePasswordReset}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700">
          Password Reset
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition"
        >
          Send Password Reset link
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
      </form>
    </div>
  );
}
