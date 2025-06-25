import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TiStarFullOutline } from "react-icons/ti";
import { IoIosHeart } from "react-icons/io";
import { IoPlayCircle } from "react-icons/io5";
import { getMovieById } from "../../apis/movie.api";
import BlurCircle from "../../components/layout/BlurCircle";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DateSelect from "../../components/movies/DateSelect/DateSelect";
import { useState } from "react";
import ReactPlayer from "react-player";
import { FiX } from "react-icons/fi";

const MovieDetail = () => {
  const { id } = useParams();

  const { data: movie } = useQuery({
    queryKey: ["movie"],
    queryFn: () => getMovieById(id),
  });

  const setting = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
  };

  const [isPlayTrailer, setIsPlayTrailer] = useState(false);

  return movie ? (
    <>
      <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-52 min-h-[80vh]">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <img
            src={movie.poster_url}
            alt=""
            className="max-md:mx-auto rounded-xl mt-40 md:mt-0 md:h-104 max-w-md md:max-w-60 object-cover"
          />

          <div className="relative flex flex-col gap-3">
            <BlurCircle top="-100px" left="60px" />
            <p className="text-primary uppercase">{movie.language}</p>
            <h1 className="text-4xl font-semibold max-w-96 text-balance">
              {movie.title}
            </h1>

            <div className="flex items-center gap-2 text-gray-300">
              <TiStarFullOutline className="w-5 h-5 text-primary fill-primary" />
              {movie.average_rating.toFixed(1)} User Rating
            </div>

            <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
              {movie.description}
            </p>

            <p>
              {movie.duration} | {movie.genre.join(" - ")} |{" "}
              {movie.release_date.split("-")[0]}
            </p>

            <div className="flex items-center flex-wrap gap-4 mt-4">
              <button
                className="flex items-center gap-2 px-7 py-3 text-sm 
            bg-gray-800 hover:bg-gray-900 transition 
            rounded-md font-medium cursor-pointer active:scale-95"
                onClick={() => setIsPlayTrailer(true)}
              >
                {" "}
                <IoPlayCircle className="h-5 w-5" /> Watch Trailer
              </button>
              <a
                href=""
                className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull
            transition rounded-md font-medium cursor-pointer active:scale-95"
              >
                Buy Tickets
              </a>
              <button>
                <div className="w-fit h-fit px-2 py-2 rounded-full bg-gray-500">
                  <IoIosHeart
                    className={`h-5 w-5 hover:text-primary transition active:scale-95`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-lg font-medium mt-20">Your Favourite Cast</p>
          <div className="mt-8 pb-4 mx-auto">
            <Slider {...setting}>
              {/* <div className="flex items-center gap-4 w-max px-4"> */}

              {movie.cast.map((cast) => (
                <div className="cursor-pointer" key={cast.id}>
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={cast.profile_image}
                      alt=""
                      className="rounded-full h-20 md:h-20 aspect-square object-cover"
                    />
                    <p>{cast.name}</p>
                  </div>
                </div>
              ))}
              {/* </div> */}
            </Slider>
          </div>
        </div>

        <DateSelect dateTime={movie.release_date} id={movie._id} />
      </div>

      {isPlayTrailer && (
        <div
          className="fixed inset-0 bg-black/70 background-blur-sm z-50 
        flex flex-col items-center justify-center p-4"
          onClick={() => setIsPlayTrailer(false)}
        >
          <div className="w-fit h-fit  border border-primary rounded-sm">
            <ReactPlayer
              url={movie.trailer_url}
              controls={false}
              playing={true}
              className="mx-auto max-w-full "
              width={"960px"}
              height={"540px"}
            />
          </div>
        </div>
      )}
    </>
  ) : (
    <div>loading</div>
  );
};

export default MovieDetail;
