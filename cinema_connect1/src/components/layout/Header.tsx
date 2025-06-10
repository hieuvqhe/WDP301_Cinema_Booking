import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiLinkedin, FiMenu, FiTwitter, FiX } from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { headerItems } from "../../const/index";
import { FiUser } from "react-icons/fi";
import LoginModal from "./LoginModal";
import { IoIosArrowUp } from "react-icons/io";
import {useNavigate } from "react-router-dom";

const Header = () => {
  // Toogle the Menu open/close
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  // State to track if the contact form is open
  const [signInFormOpen, setsignInFormOpen] = useState(false);

  const openSignInForm = () => setsignInFormOpen(true);
  const closeSignInForm = () => setsignInFormOpen(false);
  return (
    <header
      className="fixed w-full h-fit z-50 transition-all 
    duration-300 border-b-gray-600 border-b-[1px] bg-gradient-to-r from-violet-900 to-gray-800"
    >
      <div
        className="container mx-auto px-4 sm:px-6 
      lg:px-8 flex items-center justify-between h-16 md:h-20"
      >
        {/* logo name */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 25,
            delay: 0.3,
            duration: 1.2,
          }}
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/home')}
        >
          <div
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-100
            flex items-center justify-center text-purple-600 font-bold text-xl mr-3"
          >
            <HiOutlineTicket className="h-6 w-6" />
          </div>

          <span
            className="text-xl font-bold bg-gradient-to-r from-gray-300 to-gray-100
            bg-clip-text text-transparent"
          >
            Cinema Connect
          </span>
        </motion.div>

        {/* Destop navigation */}
        <nav className="lg:flex hidden space-x-8">
          {headerItems.map((item, index) => {
            return (
              <motion.a
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.7 + index * 0.2,
                }}
                href=""
                className="relative text-gray-200 dark:text-gray-200
                  hover:via-violet-600 dark:hover:text-violet-400 font-medium
                  transition-colors duration-300 group"
              >
                <div className="flex items-center gap-2 group">
                  {item.title}
                  {item.content && item.content.length > 0 && (
                    <span>
                      <IoIosArrowUp className="rotate-180 group-hover:rotate-0 transition-all duration-300" />
                    </span>
                  )}
                </div>

                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5
                  bg-violet-600 group-hover:w-full transition-all
                  duration-300"
                ></span>
              </motion.a>
            );
          })}
        </nav>

        {/* Navbar shortlink */}
        <div className="md:flex hidden items-center space-x-1">
          <motion.a
            onClick={openSignInForm}
            href="#"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="text-gray-700 dark:text-gray-300 hover:text-violet-600
          dark:hover:text-violet-400 transition-colors duration-300"
          >
            <div className="h-fit w-fit p-2 rounded-full bg-gray-100">
              <FiUser className="h-5 w-5" />
            </div>
          </motion.a>

          {/* Search Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1.3,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            // onClick={openContactForm}
            className="ml-4 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100
          text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700
          hover:text-white transition-all duration-500 cursor-pointer"
          >
            <IoSearchOutline />
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="md:hidden flex items-center"
        >
          <motion.button
            whileTap={{ scale: 0.7 }}
            onClick={toggleMenu}
            className="text-gray-300 cursor-pointer"
          >
            {isOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.5 }}
        className="md:hidden overflow-hidden bg-white dark:bg-gray-900 shadow-lg
      px-4 py-5 space-y-5"
      >
        <nav className="flex flex-col space-y-3">
          {["Home", "Home", "Home"].map((item, index) => (
            <a href="#" key={index} className="text-gray-300 font-medium py-2">
              {item}
            </a>
          ))}
        </nav>

        <div
          className="pt-4 border-t border-gray-200 
        dark:border-gray-700"
        >
          <div className="flex space-x-5">
            <a href="#">
              <FiUser className="h-5 w-5 text-gray-300" />
            </a>
            <a href="#">
              <FiTwitter className="h-5 w-5 text-gray-300" />
            </a>
            <a href="#">
              <FiLinkedin className="h-5 w-5 text-gray-300" />
            </a>
          </div>

          <button
            // onClick={openContactForm}
            className="mt-4 block w-full px-4 py-2 rounded-lg
          bg-gradient-to-r from-violet-600 to-violet-400 font-bold"
          >
            <IoSearchOutline />
          </button>
        </div>
      </motion.div>

      {/* Login Modal */}
      <AnimatePresence>
        {signInFormOpen && <LoginModal closeModal={closeSignInForm} />}
      </AnimatePresence>
    </header>
  );
};

export default Header;
