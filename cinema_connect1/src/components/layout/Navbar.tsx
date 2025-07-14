import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import LoginModal from "../user/LoginModal";
import { useAuthStore } from "../../store/useAuthStore";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Avatar from "../ui/Avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { title: "Home", link: "/" },
      { title: "Movies", link: "/movies" },
      { title: "Theater", link: "/my-bookings" },
      { title: "Favourites", link: "/favourite" },
    ];

    if (!user) {
      return baseItems;
    }

    switch (user.role) {
      case "admin":
        return [...baseItems, { title: "Admin Dashboard", link: "/admin" }];
      case "staff":
        return [...baseItems, { title: "Partner Dashboard", link: "/partner" }];
      case "customer":
      default:
        return [
          ...baseItems,
          // { title: "My Bookings", link: "/my-bookings" },
          // { title: "Favourites", link: "/favourite" },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const getUserQuickAccess = () => {
    const baseActions = [
      {
        title: "Profile",
        link: "/profile",
      },
      {
        title: "My Bookings",
        link: "/my-bookings",
      },
      {
        title: "Payment History",
        link: "/payment-history",
      },
      {
        title: "Sign out",
        link: "",
        action: () => logout(),
      },
    ];

    if (user?.role === "customer") {
      return [
        {
          title: "Favourites",
          link: "/favourite",
          action: () => console.log("Favourites"),
        },
        {
          title: "My Bookings",
          link: "/my-bookings",
          action: () => console.log("My Bookings"),
        },
        ...baseActions,
      ];
    }

    return baseActions;
  };

  const userQuickAccess = getUserQuickAccess();

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6
          md:px-16 lg:px-36 py-5 transition-all duration-300 ${
            isScrolled
              ? "bg-gradient-to-r from-purple-600/90 via-purple-700/90 to-indigo-600/90 backdrop-blur-md border-b border-white/20 shadow-lg"
              : "bg-transparent"
          }`}
      >
        <Link to={"/"} className="max-md:flex-1">
          <img
            src={"logo.png"}
            alt=""
            className={`w-14 h-14 transition-all duration-300 ${
              isScrolled ? "border-2 border-white/30 rounded-full p-1" : ""
            }`}
          />
        </Link>

        <div
          className={`
                max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium 
                max-md:text-lg z-50 flex flex-col md:flex-row md:px-5 md:rounded-full items-center 
                max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen 
                min-md:rounded-full backdrop-blur overflow-hidden transition-all duration-300
                ${isOpen ? "max-md:w-full" : "max-md:w-0"}
                ${
                  isScrolled
                    ? "bg-black/80 md:bg-white/15 md:border border-white/30"
                    : "bg-black/70 md:bg-white/10 md:border border-gray-300/20"
                }`}
        >
          <FaTimes
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer transition-colors duration-300 ${
              isScrolled
                ? "text-white hover:text-gray-200"
                : "text-white hover:text-gray-300"
            }`}
          />
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              className="nav-hover-btn"
              to={item.link}
              onClick={() => setIsOpen(!isOpen)}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <IoIosSearch
            className={`max-md:hidden w-6 h-6 cursor-pointer transition-colors duration-300 ${
              isScrolled
                ? "text-white hover:text-gray-200"
                : "text-white hover:text-gray-300"
            }`}
          />

          {user ? (
            <div>
              <Popover as="div" className="relative inline-block text-left">
                <PopoverButton
                  className={`p-1 rounded-full transition-all duration-300 ${
                    isScrolled
                      ? "bg-white/20 hover:bg-white/30 shadow-lg border border-white/30"
                      : "bg-primary hover:bg-primary/80"
                  }`}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="md"
                    className={`transition-all duration-300 ${
                      isScrolled
                        ? "border-2 border-white/40"
                        : "border-2 border-white/20"
                    }`}
                  />
                </PopoverButton>

                <PopoverPanel
                  className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg shadow-lg ring-1 ring-black/5 transition-all duration-300 ${
                    isScrolled
                      ? "bg-gradient-to-br from-purple-600/95 to-indigo-600/95 backdrop-blur-md border border-white/20"
                      : "bg-primary/40 border border-primary/20"
                  }`}
                >
                  <div
                    className={`text-sm py-2 px-4 text-center border-b transition-colors duration-300 ${
                      isScrolled
                        ? "border-white/20 text-white"
                        : "border-slate-50 border-b text-white"
                    }`}
                  >
                    <p>Hello {user.name}</p>
                  </div>
                  <div className="py-1">
                    {userQuickAccess.map((item, index) =>
                      item.link ? (
                        <Link
                          key={index}
                          to={item.link}
                          className={`block px-4 py-2 text-sm transition-all duration-200 ${
                            isScrolled
                              ? "text-white hover:text-gray-200 hover:bg-white/10"
                              : "text-gray-200 hover:underline"
                          }`}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <a
                          key={index}
                          href="#"
                          className={`block px-4 py-2 text-sm transition-all duration-200 ${
                            isScrolled
                              ? "text-white hover:text-gray-200 hover:bg-white/10"
                              : "text-gray-200 hover:underline"
                          }`}
                          onClick={item.action}
                        >
                          {item.title}
                        </a>
                      )
                    )}
                  </div>
                </PopoverPanel>
              </Popover>
            </div>
          ) : (
            <button
              className="px-4 py-1 sm:px-7 sm:py-2 bg-[#F84565] hover:bg-[#D63854]
            transition rounded-full font-medium cursor-pointer"
              onClick={() => setIsLoginForm(true)}
            >
              Login
            </button>
          )}
        </div>

        <IoMenu
          className={`max-md:ml-4 md:hidden w-8 h-8 cursor-pointer transition-colors duration-300 ${
            isScrolled
              ? "text-white hover:text-gray-200"
              : "text-white hover:text-gray-300"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isLoginForm && <LoginModal isFormOpen={setIsLoginForm} />}
    </>
  );
};

export default Navbar;
