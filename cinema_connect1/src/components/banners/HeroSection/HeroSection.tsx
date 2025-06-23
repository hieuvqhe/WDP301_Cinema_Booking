import { IoIosCalendar } from "react-icons/io";
import { GoClock } from "react-icons/go";
import { BsArrowRight } from "react-icons/bs";

const HeroSection = () => {
  return (
    <div
      className="flex flex-col items-start justify-center 
    gap-4 px-6 md:px-16 lg:px-36 bg-[url('assets/guardiansGalaxy.jpg')]
    bg-cover bg-center h-screen"
    >
      {/* <img src={""} alt="" className="max-h-11 lg:h-11 mt-20" /> */}

      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
        Guardians <br /> of the Galaxy
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Adventure | Scifi</span>

        <div className="flex items-center gap-1">
          <IoIosCalendar className="w-4.5 h-4.5" /> 2018
        </div>

        <div className="flex items-center gap-1">
          <GoClock className="w-4.5 h-4.5" /> 2h24
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        In a post-apocalyptic world where cities ride on wheels and consume each
        other to survive, two people meet in London and try to stop a
        conspiracy.
      </p>

      <button className="flex items-center gap-1 px-6 py-3 text-sm 
      bg-primary hover:bg-primary-dull transition rounded-full 
      font-medium cursor-pointer">
        Explore Movies
        <BsArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;
