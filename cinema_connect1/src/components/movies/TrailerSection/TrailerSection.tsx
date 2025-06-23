import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { BiPlayCircle } from "react-icons/bi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Movie } from "../../../types";
import { getPopularMovies } from "../../../apis/movie.api";
import BlurCircle from "../../layout/BlurCircle";

const TrailerSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };
  const [getShowingMovies, setGetShowingMovies] = useState<Movie[]>([]);
  const [currentTrailer, setCurrentTrailer] = useState<string | undefined>(
    undefined
  );
  const [isChangeTrailer, setIsChangeTrailer] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movies = await getPopularMovies(10);
        setGetShowingMovies(movies);
        if (movies.length > 0) {
          setCurrentTrailer(movies[0].trailer_url);
        }
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      }
    };

    fetchData();
  }, []);

  const handleClickTrailer = (trailerUrl: string | undefined) => {
    setCurrentTrailer(trailerUrl);

    const trailerElement = document.getElementById("trailer-main");
    trailerElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsChangeTrailer(true)
  };

  return (
    <div id="trailer-main" className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Comming Soon Trailers
      </p>

      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        <ReactPlayer
          url={currentTrailer}
          controls={false}
          playing={isChangeTrailer ? true : false}
          className="mx-auto max-w-full"
          width={"960px"}
          height={"540px"}
        />
      </div>
      <div className="mt-8 max-w-3xl mx-auto">
        {/* <div className=""> */}
        <Slider {...settings}>
          {getShowingMovies.map((trailer) => (
            <div
              key={trailer.trailer_url}
              className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 
      transition max-md:h-60 md:max-h-60 cursor-pointer group"
              onClick={() => handleClickTrailer(trailer.trailer_url)}
            >
              <img
                src={trailer.poster_url}
                alt="trailer"
                className="rounded-lg w-full h-full object-cover brightness-75"
              />
              <BiPlayCircle
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2 hidden group-hover:block duration-300 transition-all"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TrailerSection;
