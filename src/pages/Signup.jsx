import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, Navigate } from "react-router";
import { sendEmailVerification } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // default role
  const [error, setError] = useState("");
  const [success, setSucess] = useState("");


  const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  setSucess("");

 

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // Store role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      role,
      createdAt: new Date(),
    });

    await sendEmailVerification(user);
    setSucess("Verification email sent!");
  } catch (err) {
    console.log(err)
    // fallback: user already exists
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setSucess("Verification email re-sent!");
      }

      // 🔥 Ensure user Firestore doc exists (especially role!)
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        role,
        createdAt: new Date(),
      }, { merge: true });

    } catch (error) {
      setError(error.message.replace(/Firebase:|auth\/|-/g, " ").trim());
    }
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-slate-200 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700 drop-shadow">
          Sign Up
        </h2>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-5 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50 placeholder:text-blue-300"
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
          className="w-full mb-5 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50 placeholder:text-blue-300"
          placeholder="Enter your password"
        />

        <label className="block mb-2 text-sm font-semibold text-gray-700">
          I am a:
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50"
        >
          <option value="client">Client</option>
          <option value="photographer">Photographer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 rounded-lg shadow-lg transition duration-200"
        >
          Create Account
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
            to={"/login"}
            className="text-blue-600 hover:underline font-semibold"
          >
            Already have an Account?
          </Link>
        </div>
      </form>
    </div>
  );
}
