import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router";
import { deleteDoc, updateDoc } from "firebase/firestore";

export default function AlbumView() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbumsByRole = async () => {
      if (!auth.currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) return;

        const userData = userDoc.data();
        const userRole = userData.role;
        setRole(userRole);

        let albumQuery;
        if (userRole === "photographer") {
          albumQuery = query(
            collection(db, "albums"),
            where("createdBy", "==", currentUser.uid)
          );
        } else {
          albumQuery = query(
            collection(db, "albums"),
            where("clientEmail", "==", currentUser.email)
          );
        }

        const snapshot = await getDocs(albumQuery);
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlbums(result);
      } catch (err) {
        console.error("Error fetching albums:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumsByRole();
  }, []);

  const getApprovalStats = (photos = []) => {
    const approved = photos.filter((p) => p.approved).length;
    const total = photos.length;
    const percent = total > 0 ? Math.round((approved / total) * 100) : 0;
    const status = percent === 100 ? "All Approved" : "In Progress";
    return { approved, total, percent, status };
  };

  const filtered = albums.filter((album) => {
    const { approved, total } = getApprovalStats(album.photos);
    if (filter === "approved") return approved === total;
    if (filter === "in-progress") return approved < total;
    return true; // all
  });

  const sorted = [...filtered].sort((a, b) => {
    const aDate = a.createdAt?.toDate();
    const bDate = b.createdAt?.toDate();

    if (sort === "oldest") return aDate - bDate;
    if (sort === "most-approved") {
      const aPct = getApprovalStats(a.photos).percent;
      const bPct = getApprovalStats(b.photos).percent;
      return bPct - aPct;
    }
    return bDate - aDate; // default newest first
  });

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this album?")) return;

  try {
    await deleteDoc(doc(db, "albums", id));
    setAlbums((prev) => prev.filter((album) => album.id !== id));
    alert("✅ Album deleted!");
  } catch (error) {
    console.error("Delete error:", error);
    alert("❌ Failed to delete album.");
  }
};

const handleRename = async (id, currentName) => {
  const newName = prompt("Enter a new album name:", currentName);
  if (!newName || newName.trim() === "" || newName === currentName) return;

  try {
    await updateDoc(doc(db, "albums", id), { albumName: newName });
    setAlbums((prev) =>
      prev.map((album) =>
        album.id === id ? { ...album, albumName: newName } : album
      )
    );
    alert("✅ Album renamed!");
  } catch (error) {
    console.error("Rename error:", error);
    alert("❌ Failed to rename album.");
  }
};


  if (loading) return <div>Loading albums...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        {role === "photographer"
          ? "📷 Uploaded Albums"
          : "📁 Albums Shared With You"}
      </h1>

      {role === "photographer" && (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 hover:border-gray-400 transition duration-200 ease-in-out cursor-pointer appearance-none bg-white pr-8"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.25em",
            }}
          >
            <option value="all">📂 All</option>
            <option value="approved">✅ All Approved</option>
            <option value="in-progress">🕐 In Progress</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 hover:border-gray-400 transition duration-200 ease-in-out cursor-pointer appearance-none bg-white pr-8"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.25em",
            }}
          >
            <option value="newest">🆕 Newest First</option>
            <option value="oldest">📅 Oldest First</option>
            <option value="most-approved">📊 Most Approved</option>
          </select>
        </div>
      )}

      {sorted.map((item, index) => {
        const { approved, total, percent, status } = getApprovalStats(
          item.photos
        );

        return (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                {item.albumName}
              </h2>
              <span className="text-sm text-gray-400">
                {total} photo{total === 1 ? "" : "s"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              📧 <span className="font-medium">Client:</span> {item.clientEmail}
            </p>

            <p className="text-sm text-gray-500 mb-2">
              🆔 <span className="font-medium">Created At:</span>{" "}
              {item.createdAt?.toDate().toLocaleDateString("en-IN")}
            </p>

            {role === "photographer" && (
              <p className="text-sm text-gray-600 mt-2">
                ✅ {approved}/{total} approved
                <span
                  className={`ml-2 font-semibold ${
                    percent === 100 ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {status}
                </span>
              </p>
            )}

            {item.photos?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {item.photos.slice(0, 4).map((photo, i) => (
                  <a
                    key={i}
                    href={photo.url}
                    target="_blank"
                    rel="noopener"
                    className="block"
                  >
                    <img
                      src={photo.url}
                      alt={`photo-${i}`}
                      className="w-full h-40 object-cover rounded-lg shadow-sm border"
                    />
                    
                  </a>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            {role === "photographer" && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleRename(item.id, item.albumName)}
                          className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        >
                          ✏️ Rename
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
            <button
              onClick={() => navigate(`/album/${item.id}`)}
              className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Open Album
            </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
