import { NavLink, Link } from "react-router";

export const Navbar = () => {
  return (
    <nav className="w-screen p-2 md:p-4  flex items-center justify-between bg-white shadow-lg fixed top-0 left-0 z-50">
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
  );
};
