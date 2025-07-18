import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // ✅ Correct package

function Navbar() {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex items-center justify-between px-4 py-5 h-14">
        <div className="logo font-bold text-white text-2xl">
          <span className="text-green-500">&lt;</span>
          Secure
          <span className="text-green-500">Nest/ &gt;</span>
        </div>

        <button className="flex items-center gap-2 bg-green-700 rounded-full text-white px-4 py-2  hover:bg-green-800 ring-white ring-1">
          <FontAwesomeIcon icon={faGithub} className="text-xl" />
          GitHub
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
