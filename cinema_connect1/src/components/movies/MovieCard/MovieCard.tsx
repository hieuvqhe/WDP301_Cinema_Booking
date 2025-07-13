import { BiStar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../../types";
import { formatGenres } from "../../../utils/format";

type MovieCardProps = {
  movie: Movie;
  onBookTicket?: (movieId: string) => void; // Optional callback for booking tickets
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl
    hover:-translate-y-1 transition duration-300 w-full max-w-[280px] mx-auto"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg">
        <img
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/logo.png'; // fallback image
          }}
        />
      </div>
      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} | {formatGenres(movie.genre)}{" "}
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
          {movie.average_rating > 0 ? movie.average_rating.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
