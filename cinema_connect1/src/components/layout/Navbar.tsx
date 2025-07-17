import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import LoginModal from "../user/LoginModal";
import { useAuthStore } from "../../store/useAuthStore";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Avatar from "../ui/Avatar";
import { useWindowScroll } from "react-use";
import gsap from "gsap";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(false);
  const { user, logout } = useAuthStore();

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);

  const { y: currentSrollY } = useWindowScroll();

  useEffect(() => {
    if (currentSrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentSrollY > lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }

    setLastScrollY(currentSrollY);
  }, [currentSrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 1 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { title: "Home", link: "/" },
      { title: "Movies", link: "/movies" },
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
        return [
          ...baseItems,
          { title: "My Bookings", link: "/my-bookings" },
          { title: "Favourites", link: "/favourite" },
        ];
      default:
        return [...baseItems];
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
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-gray-800 text-white transition-all duration-300"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu dropdown khi mở */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-64 bg-gray-600 shadow-lg flex flex-col pt-16 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                className="nav-hover-btn py-3 rounded-md"
                to={item.link}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))} 
          </div>
        </div>
      )}
      <div
        ref={navContainerRef}
        className={`fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700
        sm:inset-x-6 flex items-center justify-between px-4 max-md:hidden`}
      >
        <Link to={"/"} className="max-md:flex-1">
          <img
            src={"logo.png"}
            alt=""
            className={`w-14 h-14 transition-all duration-300`}
          />
        </Link>

        <div>
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
            className={`max-md:hidden w-6 h-6 cursor-pointer transition-colors duration-300 `}
          />

          {user ? (
            <div>
              <Popover as="div" className="relative inline-block text-left">
                <PopoverButton
                  className={`p-1 rounded-full transition-all duration-300 `}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="md"
                    className={`transition-all duration-300 `}
                  />
                </PopoverButton>

                <PopoverPanel
                  className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg shadow-lg ring-1 
                    ring-black/5 transition-all duration-300 bg-primary-dull`}
                >
                  <div
                    className={`text-sm py-2 px-4 text-center border-b transition-colors duration-300 `}
                  >
                    <p>Hello {user.name}</p>
                  </div>
                  <div className="py-1">
                    {userQuickAccess.map((item, index) =>
                      item.link ? (
                        <Link
                          key={index}
                          to={item.link}
                          className={`block px-4 py-2 text-sm transition-all duration-200 `}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <a
                          key={index}
                          href="#"
                          className={`block px-4 py-2 text-sm transition-all duration-200 `}
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
      </div>

      {isLoginForm && <LoginModal isFormOpen={setIsLoginForm} />}
    </>
  );
};

export default Navbar;
