import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebase";

export default function UploadAlbum() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="bg-blue-700 text-white flex md:flex px-4 md:px-5 py-2 rounded-lg shadow-lg text-sm cursor-pointer md:text-base"
        onClick={() => setIsOpen(true)}
      >
        Upload Album
      </button>
      {isOpen && <Modal setIsOpen={setIsOpen} />}
    </>
  );
}

function Modal({ setIsOpen }) {
  function handleCloseModal(e) {
    if (e.target.id === "modal-overlay") {
      setIsOpen(false);
    }
  }

  const [albumName, setAlbumName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [cldResponse, setCldResponse] = useState(null);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const uploadFiles = async () => {
    if (!albumName || !clientEmail || files.length === 0) {
      alert("Please fill all fields and select files.");
      return;
    }

    setUploading(true);
    const uploadedPhotos = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        uploadedPhotos.push({
          url: data.secure_url,
          approved: false,
          comment: "",
        });
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }

    // TODO: Save uploadedPhotos + albumName + clientEmail to Firestore
    try {
      await addDoc(collection(db, "albums"), {
        albumName,
        clientEmail,
        photos: uploadedPhotos,
        createdAt: Timestamp.now(),
        createdBy: auth.currentUser.uid,
      });

      setUploadComplete(true);
      setUploading(false);

      setFiles([]);
      setAlbumName("");
      setClientEmail("");
      setCldResponse(uploadedPhotos);
    } catch (err) {
      console.error("Error saving album to Firestore:", err.message);
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleCloseModal}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <form
        id="form"
        className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upload Your Album
        </h2>
        <div className="mb-4">
          <label
            htmlFor="albumName"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Album Name:
          </label>
          <input
            type="text"
            id="albumName"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter album name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="fileUpload"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Select Files:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            multiple
            accept="image/*"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg mr-3 hover:bg-gray-300 transition-colors duration-200 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {uploadComplete && cldResponse && (
          <div className="p-3 mt-4 bg-green-100 text-green-700 rounded-md text-center font-medium shadow-sm">
            File uploaded successfully
          </div>
        )}
      </form>
    </div>
  );
}
