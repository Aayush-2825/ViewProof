import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import PhotoGrapherDashboard from "./photographer/PhotoGrapherDashboard";
import ClientDashboard from "./client/ClientDashboard";



export default function Dashboard() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData.role);
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user role:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="overflow-hidden">
      {role === "photographer" ? (
        <PhotoGrapherDashboard role={role}/>
      ) : (
        <ClientDashboard/>
      )}
    </div>
  );
}
