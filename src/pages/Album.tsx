import { doc, getDoc, Timestamp, updateDoc  } from "firebase/firestore";
import { useNavigate, useParams } from "react-router"; 
import { db, auth } from "../firebase";
import { useEffect, useState } from "react";



type Photo = {
  url: string;
  approved?: boolean;
  comment?: string;
};

type AlbumData = {
  albumName: string;
  clientEmail: string;
  createdAt: Timestamp;
  photos: Photo[];
};

export default function Album() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [albumData, setAlbumData] = useState<AlbumData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [role, setRole] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in.");
        return;
      }

      // ✅ Get user role
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("User record not found.");
        return;
      }

      const userData = userDoc.data();
      const userRole = userData.role;
      setRole(userRole);

      // ✅ Fetch album
      const albumRef = doc(db, "albums", id!);
      const albumSnap = await getDoc(albumRef);
      if (!albumSnap.exists()) {
        setError("Album not found.");
        return;
      }

      const data = albumSnap.data();

      // 🔒 Restrict access
      if (
        (userRole === "client" && data.clientEmail !== user.email) ||
        (userRole === "photographer" && data.createdBy !== user.uid)
      ) {
        setError("⛔ You are not authorized to view this album.");
        return;
      }

      setAlbumData(data as AlbumData);
      setPhotos(data.photos || []);
    } catch (err) {
      console.error("Error loading album:", err);
      setError("Failed to load album.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  const toggleApproval = (index) => {
    const updated = [...photos];
    updated[index].approved = !updated[index].approved;
    setPhotos(updated);
  };

  const updateComment = (index, value) => {
    const updated = [...photos];
    updated[index].comment = value;
    setPhotos(updated);
  };

  const savePhotoChanges = async () => {
    try {
       if (!id) {
          setError("Invalid album ID.");
          setLoading(false);
          return;
        }
      const albumRef = doc(db, "albums", id);
      await updateDoc(albumRef, { photos });
      alert("✅ Changes saved!");
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Failed to save changes.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">
          Loading album...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-bold text-red-600 p-6 bg-white rounded-lg shadow-md">
          {error}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 sm:mb-0">
            {albumData?.albumName || "Untitled Album"}
          </h1>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {photos.length} photo{photos.length !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          &larr; Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
          <p>
            <span className="font-semibold text-gray-800">Client Email:</span>{" "}
            {albumData?.clientEmail}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Created On:</span>{" "}
            {albumData?.createdAt?.toDate().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="bg-white border rounded-lg shadow-sm p-3 flex flex-col transition hover:shadow-md"
              >
                <a href={photo.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={photo.url}
                    alt={`photo-${i}`}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                </a>

                {role === "client" && (
                  <>
                    <button
                      onClick={() => toggleApproval(i)}
                      className={`w-full text-sm font-medium px-3 py-1 mb-2 rounded-full border ${
                        photo.approved
                          ? "text-green-700 border-green-600 bg-green-50 hover:bg-green-100"
                          : "text-gray-500 border-gray-400 hover:bg-gray-100"
                      } transition`}
                    >
                      {photo.approved ? "✅ Approved" : "❌ Not Approved"}
                    </button>

                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={photo.comment || ""}
                      onChange={(e) => updateComment(i, e.target.value)}
                      className="text-sm w-full px-3 py-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </>
                )}
                
              </div>
            ))}
            
          </div>
        ) : (
          <div className="text-center py-10 text-gray-600 text-lg">
            No photos available for this album yet.
          </div>
        )}

        {role === "client" && (
          <div className="mt-10 flex justify-end">
            <button
              onClick={savePhotoChanges}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              💾 Save All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
