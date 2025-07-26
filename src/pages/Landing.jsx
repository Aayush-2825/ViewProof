import { Link, NavLink } from "react-router";

function Landing() {
  return (
    <div className="min-h-screen max-w-screen bg-gradient-to-br  overflow-x-hidden from-slate-50 via-blue-50 to-slate-100 relative font-sans">
      {/* Navbar */}
      <nav className="w-screen p-2 md:p-4 flex items-center justify-between bg-white shadow-lg fixed top-0 left-0 z-50">
        <div className="flex items-center gap-4">
          <NavLink to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 md:h-12 w-auto rounded transition-transform duration-200 hover:scale-105"
              style={{ maxWidth: "120px" }}
            />
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "active font-bold text-blue-700 text-lg md:text-xl"
                : "font-bold text-gray-800 text-lg md:text-xl hover:text-blue-600 transition-colors"
            }
          >
            <h1 className="tracking-wide">ViewProof</h1>
          </NavLink>
        </div>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive
              ? "active bg-blue-700 text-white hidden md:flex px-4 md:px-5 py-2 rounded-lg shadow-lg text-sm md:text-base"
              : "bg-blue-500 text-white px-4 md:px-5 hidden md:flex py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg text-sm md:text-base"
          }
        >
          Sign Up
        </NavLink>
      </nav>

      {/* hero section */}
      <section
        className="flex flex-col md:flex-row items-center justify-end md:justify-end pt-24 md:pt-32 p-6 md:p-16 h-screen w-screen bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-400/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 md:px-6 w-full md:w-1/2">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Effortless Photo Delivery
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 font-medium drop-shadow">
            Clients can view, comment, and approve their photo albums securely
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/signup"
              className="bg-white text-blue-700 px-4 md:px-5 py-2 md:py-3 rounded-xl font-semibold hover:bg-blue-50 transition w-full md:w-auto shadow text-nowrap"
            >
              Login as Client
            </Link>
            <Link
              to="/dashboard"
              className="bg-transparent border border-white px-4 md:px-5 py-2 md:py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition w-full md:w-auto shadow text-nowrap"
            >
              Photographer Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* who is it for */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Who is it for?
        </h2>
        <p className="text-slate-600 text-lg mb-8">
          ViewProof is built for photographers who work with{" "}
          <b>clients, models, couples, brands</b> — anyone who needs a
          beautiful, secure, and fast way to share work.
        </p>
      </section>

      {/* feature section */}
      <section className="py-16 px-6 bg-slate-100 ">
        <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl shadow p-6 hover:scale-105 transition">
            <span className="text-4xl">🖼️</span>
            <h3 className="text-xl font-semibold mt-2">View Albums</h3>
            <p className="text-slate-600 mt-1">
              Clients can view their photo sets in private galleries.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:scale-105 transition">
            <span className="text-4xl">✅</span>
            <h3 className="text-xl font-semibold mt-2">Approve Photos</h3>
            <p className="text-slate-600 mt-1">
              Mark final selections with a single click.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:scale-105 transition">
            <span className="text-4xl">💬</span>
            <h3 className="text-xl font-semibold mt-2">Leave Feedback</h3>
            <p className="text-slate-600 mt-1">
              Clients can add notes to each photo.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:scale-105 transition">
            <span className="text-4xl">🔐</span>
            <h3 className="text-xl font-semibold mt-2">Secure Access</h3>
            <p className="text-slate-600 mt-1">
              Photos are shared privately using email-based login.
            </p>
          </div>
        </div>
      </section>

      {/* testimonial section */}
      <section className="bg-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          What Clients Say
        </h2>
        <blockquote className="max-w-2xl mx-auto italic text-slate-600 bg-slate-50 rounded-xl shadow p-8">
          “ViewProof made it so easy to review and approve our wedding photos.
          The interface is clean, and communication with our photographer was
          seamless.”
          <br />
          <span className="font-semibold not-italic text-slate-800 mt-4 block">
            — Priya & Raghav
          </span>
        </blockquote>
      </section>

      <footer className="bg-slate-900 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} ViewProof. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
