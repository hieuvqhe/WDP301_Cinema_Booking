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
      img_url: "guardiansGalaxy.jpg",
      title: "Guardian of the Galaxy",
      type: "",
      start_date: "",
      end_date: "",
      description: "",
    },
    {
      img_url: "avenger_endgame.jpg",
      title: "Avengers: Endgame",
      type: "Actions",
      start_date: "2025-07-01",
      end_date: "2025-08-15",
      description:
        "A mind-bending thriller that blurs the line between dream and reality.",
    },
    {
      img_url: "avatar2.jpg",
      title: "Avatar: The Way of Water",
      type: "Fantasy",
      start_date: "2025-06-20",
      end_date: "2025-08-01",
      description:
        "Return to Pandora in an epic sequel filled with breathtaking underwater visuals.",
    },
    {
      img_url: "johnWick4.png",
      title: "John Wick 4",
      type: "Action",
      start_date: "2025-06-25",
      end_date: "2025-07-30",
      description:
        "John Wick returns with more action, assassins, and revenge than ever before.",
    },
    {
      img_url: "spidermanAcross.jpg",
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
    pauseOnHover: true,
  };

  return (
    <div className="overflow-hidden"> 
      <Slider {...settings}>
        {sliderBanners?.map((banner) => (
          <div
            key={banner.title}
            className={`gap-4 px-6 md:px-16 lg:px-36 bg-[url('guardiansGalaxy.jpg')]
                bg-cover bg-center h-screen w-full relative top-1`}
          >
            {/* <img src={""} alt="" className="max-h-11 lg:h-11 mt-20" /> */}
            <div className="relative top-1/2 flex flex-col gap-4">
              <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
                {banner.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-300">
                <span>{banner.type}</span>

                <div className="flex items-center gap-1">
                  <IoIosCalendar className="w-4.5 h-4.5" /> {banner.start_date}
                </div>

                <div className="flex items-center gap-1">
                  <GoClock className="w-4.5 h-4.5" /> {banner.end_date}
                </div>
              </div>

              <p className="max-w-md text-gray-300">{banner.description}</p>

              <button
                className="flex items-center gap-1 px-10 py-3 text-sm 
      bg-primary hover:bg-primary-dull transition rounded-full 
      font-medium cursor-pointer max-w-fit"
              >
                Explore Movies
                <BsArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
