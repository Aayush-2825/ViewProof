# 📸 ViewProof

*ViewProof* is a web platform designed for photographers to upload albums and share them with clients. Clients can view, comment on, and approve photos individually — streamlining the feedback and delivery process.

## 🔗 Live Demo

🌐 [https://view-proof.vercel.app](https://view-proof.vercel.app)

## 🚀 Features

- 🔐 *Authentication & Roles* (Client / Photographer)
- 📤 *Upload Albums* (Photographer only)
- 📁 *Album Access by Role* (Client sees their albums, Photographer sees their uploads)
- ✅ *Photo Approval & Commenting* (Client-side interaction per photo)
- ✏ *Rename / Delete Albums* (Photographer)
- 📊 *Progress Tracking* (e.g. 8/10 photos approved)
- 🌤 *Cloudinary* used for secure, scalable photo hosting
- 💾 *Firestore* for storing album and user data
- 📱 *Fully Responsive UI*

## ⚙ Tech Stack

- *Frontend*: React + TailwindCSS
- *Routing & State*: React Router + useState/useEffect
- *Auth & DB*: Firebase Authentication + Firestore
- *File Storage*: Cloudinary (with chunked upload support)
- *Deployment*: Vercel

## 🧪 Test Accounts

You can create accounts with role-based access:
- 👤 Photographer: Upload albums
- 👥 Client: View and interact with assigned albums

