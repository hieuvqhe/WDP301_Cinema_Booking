import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPopularMovies } from "../../../apis/movie.api";
import type { Movie } from "../../../types";
import MovieCard from "../../movies/MovieCard/MovieCard";
import BlurCircle from "../../layout/BlurCircle";




const FeaturedSection = () => {
  const navigate = useNavigate();

  const [getShowingMovies, setGetShowingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movies = await getPopularMovies(10);
        setGetShowingMovies(movies);
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top={"0"} right={"-80px"} />
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300"
        >
          View All
          <BsArrowRight
            className="group-hover:translate-x-0.5 transition
                w-4.5 h-4.5"
          />
        </button>
      </div>

      <div className="grid grid-cols-2 md:flex max-sm:justify-center gap-8 mt-8">
        {getShowingMovies.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull
        transition rounded-md font-medium cursor-pointer"
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
