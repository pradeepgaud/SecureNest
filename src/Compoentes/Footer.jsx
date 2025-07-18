import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons"; // ✅ Corrected!

function Footer() {
  return (
    <div className="bg-slate-800 text-white flex flex-col justify-center items-center ">  
    {/* fixed bottom-0 w-full */}
      <div className="logo font-bold text-white flex justify-center items-center">
        <span className="text-green-500">&lt;</span>
        Secure
        <span className="text-green-500">Nest/ &gt;</span>
      </div>

      <div className="text-center ">
        Created with <FontAwesomeIcon icon={faHeart} className="text-red-500" />{" "}
        by Pradeep
      </div>
    </div>
  );
}

export default Footer;
