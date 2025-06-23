import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6
    md:px-16 lg:px-36 py-5"
    >
      <Link to={"/"} className="max-md:flex-1">
        <img src={"assets/logo.png"} alt="" className="w-14 h-14" />
      </Link>

      <div
        className={`
                max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium 
                max-md:text-lg z-50 flex flex-col md:flex-row md:px-5 md:rounded-full items-center 
                max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen 
                min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border 
                 border-gray-300/20 overflow-hidden transition-[width] duration-300  ${
                   isOpen ? "max-md:w-full" : "max-md:w-0"
                 }`}
      >
        <FaTimes
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
        />
        <Link
          className="nav-hover-btn"
          to={"/"}
          onClick={() => setIsOpen(!isOpen)}
        >
          Home
        </Link>
        <Link
          className="nav-hover-btn"
          to={"/movies"}
          onClick={() => setIsOpen(!isOpen)}
        >
          Movies
        </Link>
        <Link
          className="nav-hover-btn"
          to={"/theaters"}
          onClick={() => setIsOpen(!isOpen)}
        >
          Theaters
        </Link>
        <Link
          className="nav-hover-btn"
          to={"/"}
          onClick={() => setIsOpen(!isOpen)}
        >
          Release
        </Link>
        <Link
          className="nav-hover-btn"
          to={"/"}
          onClick={() => setIsOpen(!isOpen)}
        >
          Favourites
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <IoIosSearch className="max-md:hidden w-6 h-6 cursor-pointer" />
        <button
          className="px-4 py-1 sm:px-7 sm:py-2 bg-[#F84565] hover:bg-[#D63854]
            transition rounded-full font-medium cursor-pointer"
        >
          Login
        </button>
      </div>

      <IoMenu
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;
