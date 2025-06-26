import { useEffect, useState } from "react";
import type { Screen } from "../types/Screen.type";
import type { Movie } from "../types/Movie.type";
import type { Showtime } from "../types/Showtime.type";
import { getScreenById } from "../apis/screen.api";
import { getMovieById } from "../apis/movie.api";
import { getShowtimeById } from "../apis/showtime.api";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [seats, setSeats] = useState<string[]>([]);
  const [screen, setScreen] = useState<Screen | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem("selected-movie-info");
    if (info) {
      const parsed = JSON.parse(info);
      if (Array.isArray(parsed.seats)) {
        setSeats(parsed.seats);
      }
      if (parsed.screenId) {
        getScreenById(parsed.screenId)
          .then(setScreen)
          .catch(() => setScreen(null));
      }
      if (parsed.movieId) {
        getMovieById(parsed.movieId)
          .then(setMovie)
          .catch(() => setMovie(null));
      }
      if (parsed.showtimeId) {
        getShowtimeById(parsed.showtimeId)
          .then(setShowtime)
          .catch(() => setShowtime(null));
      }
    }
  }, []);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (!screen || seats.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-gray-400 text-lg">
        Không có thông tin ghế/vé.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-12">
      <div className="bg-[#1E1E1E] rounded-3xl shadow-xl p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Vé của bạn</h1>

        {/* Thông tin phim */}
        <div className="text-center mb-6 space-y-1">
          {movie && (
            <p className="text-xl font-semibold text-yellow-400">
              🎬 {movie.title}
            </p>
          )}
          {showtime && (
            <p>
              🕐 Suất chiếu:{" "}
              <span className="text-gray-400">
                {formatTime(showtime.start_time)}
              </span>
            </p>
          )}
        </div>

        {/* Thông tin màn hình */}
        <div className="text-center mb-6 space-y-1">
          <p className="text-lg font-semibold">
            Màn hình: <span className="text-primary">{screen.name}</span>
          </p>
          <p>
            Loại màn hình:{" "}
            <span className="text-gray-400">{screen.screen_type}</span>
          </p>
          <p>
            Rạp: <span className="text-gray-400">{screen.theater?.name}</span>
          </p>
          <p>
            Địa điểm:{" "}
            <span className="text-gray-400">
              {screen.theater?.location}, {screen.theater?.city}
            </span>
          </p>
        </div>

        {/* Danh sách ghế */}
        <div className="border-t border-gray-700 pt-4">
          <h2 className="text-lg font-semibold mb-3">Ghế đã chọn:</h2>
          <div className="flex flex-wrap gap-2">
            {seats.map((seat, i) => (
              <div
                key={i}
                className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {seat}
              </div>
            ))}
          </div>
        </div>

        {/* Nút thanh toán */}
        <button
          className="mt-8 w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white font-semibold transition"
          onClick={() => {
            navigate("/home");
          }}
        >
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
}
