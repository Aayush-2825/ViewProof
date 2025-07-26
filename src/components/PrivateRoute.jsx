import { Navigate, Outlet } from "react-router";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PrivateRoute() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}
