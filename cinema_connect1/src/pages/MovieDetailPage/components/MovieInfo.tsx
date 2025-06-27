import { FaStar } from "react-icons/fa";
import { getCountryDisplay } from "../../../const/language";
import type { Movie } from "../../../types/Movie.type";
import CastList from "./CastList";
import type { GetTheatersResponse } from "../../../types/Theater.type";
import type { Showtime } from "../../../types/Showtime.type";
import TheaterShowtime from "./TheaterShowtime";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../../components/user/LoginModal";
import { useState } from "react";

type Props = {
  movie: Movie;
  selectedInfo: any;
  setSelectedInfo: (val: any) => void;
  theater: GetTheatersResponse | null;
  showtimes: Showtime[];
  fetchShowtimesByTheater: (id: string) => void;
  handleBookSeats: () => void;
  userId?: string | null;
};
export default function MovieInfo({
  movie,
  selectedInfo,
  setSelectedInfo,
  theater,
  showtimes,
  fetchShowtimesByTheater,
  handleBookSeats,
  userId,
}: Props) {
  const [isLoginForm, setIsLoginForm] = useState(false);
  return (
    <div className="md:col-span-2">
      <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
      <p className="mb-1">Đạo diễn: {movie.director}</p>
      <p className="mb-1">Ngôn ngữ: {getCountryDisplay(movie.language)}</p>
      <p className="mb-1">
        Ngày phát hành:{" "}
        {new Date(movie.release_date).toLocaleDateString("vi-VN")}
      </p>
      <p className="mb-1">Thời lượng: {movie.duration} phút</p>
      <p className="mb-1">Thể loại: {movie.genre.join(", ")}</p>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`mr-1 ${
              i < Math.round((movie.average_rating || 0) / 2)
                ? "text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2">({movie.average_rating}/10)</span>
        <span className="ml-2 text-sm text-gray-400">
          ({movie.ratings_count} đánh giá)
        </span>
      </div>
      <p className="mb-4">{movie.description}</p>
      <CastList movie={movie} />
      <TheaterShowtime
        theater={theater}
        selectedInfo={selectedInfo}
        setSelectedInfo={setSelectedInfo}
        showtimes={showtimes}
        fetchShowtimesByTheater={fetchShowtimesByTheater}
      />
      <div className="mt-4 flex justify-end">
        {userId ? (
          <button
            onClick={handleBookSeats}
            disabled={!selectedInfo.showtimeId}
            className="px-4 py-2 text-xs text-white bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp theo
          </button>
        ) : (
          <button
            onClick={() => setIsLoginForm(true)}
            className="px-4 py-2 text-xs text-white bg-red-500 hover:bg-red-600 transition rounded-full font-medium cursor-pointer"
          >
            Đăng nhập để đặt vé
          </button>
        )}
      </div>
      {isLoginForm && <LoginModal isFormOpen={setIsLoginForm} />}
    </div>
  );
}
