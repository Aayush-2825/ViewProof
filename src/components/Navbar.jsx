import { NavLink, Link, Navigate } from "react-router";
import { getAuth, signOut } from "firebase/auth";

export const Navbar = () => {

  const handleSignout = () =>{
    const auth = getAuth()
    signOut(auth).then(()=>{
      Navigate('/login')
    }).catch((error)=>{
      console.log(error)
    })
  }


  return (
    <nav className="w-screen p-2 md:p-4  flex items-center justify-between bg-white shadow-lg ">
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
        <button
          className= " bg-blue-700 text-white hidden md:flex px-4 md:px-5 py-2 rounded-lg shadow-lg text-sm cursor-pointer md:text-base"
          onClick={handleSignout}
        >
          Sign out
        </button>
      </nav>
  );
};
