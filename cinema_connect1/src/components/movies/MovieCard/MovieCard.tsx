import { BiStar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../../types";

type MovieCardProps = {
  movie: Movie;
  onBookTicket?: (movieId: string) => void; // Optional callback for booking tickets
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl
    hover:-translate-y-1 transition duration-300 w-full"
    >
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={movie.poster_url}
        alt=""
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />
      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} | {movie.genre.join(" - ")}{" "}
        | {movie.duration} mins
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull 
        transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p
          className="flex items-center gap-1 text-sm text-gray-400
         mt-1 pr-1"
        >
          <BiStar className="w-4 h-4 text-primary fill-primary" />
          {movie.ratings_count.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
