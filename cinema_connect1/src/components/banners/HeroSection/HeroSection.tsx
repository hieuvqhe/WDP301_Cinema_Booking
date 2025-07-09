import { IoIosCalendar } from "react-icons/io";
import { GoClock } from "react-icons/go";
import { BsArrowRight } from "react-icons/bs";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import { getHomeSliderBanners } from "../../../apis/banner.api";
// import { useQuery } from "@tanstack/react-query";

const HeroSection = () => {
  // const {
  //   isLoading: isLoadingBanners,
  //   isError: isErrorBanners,
  //   data: sliderBanners1,
  //   error: errorBanners,
  // } = useQuery({
  //   queryKey: ["bannerSliders"],
  //   queryFn: () => getHomeSliderBanners(),
  // });

  const sliderBanners = [
    {
      img_url: "/guardiansGalaxy.jpg",
      title: "Guardian of the Galaxy",
      type: "Sci-Fi",
      start_date: "2025-06-15",
      end_date: "2025-07-31",
      description: "An epic space adventure with unforgettable characters and stunning visuals.",
    },
    {
      img_url: "/avenger_endgame.jpg",
      title: "Avengers: Endgame",
      type: "Action",
      start_date: "2025-07-01",
      end_date: "2025-08-15",
      description:
        "The ultimate battle to save the universe. Heroes unite for one final fight.",
    },
    {
      img_url: "/avatar2.jpg",
      title: "Avatar: The Way of Water",
      type: "Fantasy",
      start_date: "2025-06-20",
      end_date: "2025-08-01",
      description:
        "Return to Pandora in an epic sequel filled with breathtaking underwater visuals.",
    },
    {
      img_url: "/johnWick4.png",
      title: "John Wick 4",
      type: "Action",
      start_date: "2025-06-25",
      end_date: "2025-07-30",
      description:
        "John Wick returns with more action, assassins, and revenge than ever before.",
    },
    {
      img_url: "/spidermanAcross.jpg",
      title: "Spider-Man: Across the Spider-Verse",
      type: "Animation",
      start_date: "2025-07-05",
      end_date: "2025-08-20",
      description:
        "Miles Morales embarks on a multiverse journey with Gwen Stacy and other Spider-People.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    // pauseOnHover: true,
  };

  return (
    <div className="overflow-hidden">
      <Slider {...settings}>
        {sliderBanners?.map((banner) => (
          <div
            key={banner.title}
            className="relative h-screen w-full"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${banner.img_url}')`
              }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center h-full px-6 md:px-16 lg:px-36">
              <div className="flex flex-col gap-4 max-w-2xl">
                <h1 className="text-5xl md:text-[70px] md:leading-tight font-semibold text-white">
                  {banner.title}
                </h1>

                <div className="flex items-center gap-4 text-gray-300">
                  <span className="bg-primary px-3 py-1 rounded-full text-sm font-medium">
                    {banner.type}
                  </span>

                  <div className="flex items-center gap-1">
                    <IoIosCalendar className="w-4 h-4" /> 
                    <span className="text-sm">{banner.start_date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <GoClock className="w-4 h-4" /> 
                    <span className="text-sm">{banner.end_date}</span>
                  </div>
                </div>

                <p className="text-lg text-gray-200 leading-relaxed">
                  {banner.description}
                </p>

                <button className="flex items-center gap-2 px-8 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer max-w-fit text-white">
                  Explore Movies
                  <BsArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;

