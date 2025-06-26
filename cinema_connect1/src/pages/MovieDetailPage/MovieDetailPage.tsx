import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import type { Movie } from "../../types/Movie.type";
import { getMovieById } from "../../apis/movie.api";
import { getCountryDisplay } from "../../const/language";
import type { Showtime } from "../../types/Showtime.type";
import { getShowtimeByMovieIdAndTheaterId } from "../../apis/showtime.api";
import { getTheaters } from "../../apis/theater.api";
import type { GetTheatersResponse } from "../../types/Theater.type";

function FeedbackItem({ feedback }: { feedback: any }) {
  return (
    <div className="border-b py-3">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${
              i < feedback.rating ? "text-yellow-400" : "text-gray-400"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {feedback.user?.email || "Ẩn danh"}
        </span>
      </div>
      <p className="text-sm">{feedback.comment}</p>
    </div>
  );
}

export default function MovieDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(
    null
  );
  const [selectScreenId, setSelectScreenId] = useState<string | null>(null);
  const [theater, setTheater] = useState<GetTheatersResponse | null>(null);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(
    null
  );
  const [feedbacks, setFeedbacks] = useState([
    {
      user: { email: "nguyenvana@gmail.com" },
      comment: "Phim rất hay, kỹ xảo đẹp mắt!",
      rating: 5,
      createdAt: "2025-06-21T12:00:00Z",
    },
    {
      user: { email: "" },
      comment: "Kịch bản hơi chậm, nhưng tổng thể ổn.",
      rating: 3,
      createdAt: "2025-06-22T14:30:00Z",
    },
  ]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  let userId: string | null = null;
  try {
    const authStorage = localStorage.getItem("auth-storage");
    userId = authStorage ? JSON.parse(authStorage).state.user._id : null;
  } catch {
    userId = null;
  }

  useEffect(() => {
    if (!id) return;
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieById(id);
        setMovie(movieData);
      } catch {
        setMovie(null);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const theaterData = await getTheaters();
        setTheater(theaterData);

        const firstId = theaterData.result?.theaters?.[0]?._id;
        if (firstId && id) {
          setSelectedTheaterId(firstId);
          fetchShowtimesByTheater(firstId);
        }
      } catch {
        setTheater(null);
      }
    };
    fetchTheater();
  }, [id]);

  const fetchShowtimesByTheater = async (theaterId: string) => {
    try {
      if (!id) return;
      const data = await getShowtimeByMovieIdAndTheaterId(id, theaterId);
      setShowtimes(data);
      setSelectedShowtimeId(null);
    } catch {
      setShowtimes([]);
    }
  };

  if (!movie) {
    return (
      <MainLayout>
        <div className="text-center text-white mt-10">
          Đang tải thông tin phim...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        className="relative min-h-screen bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(20,20,20,0.5),rgba(20,20,20,0.5)), url(${movie.poster_url})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 p-6 max-w-6xl mx-auto pt-20 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 bg-gray-900/90 p-6 rounded-[30px]"
          >
            <div className="flex flex-col items-center">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="rounded w-full"
              />
            </div>
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <p className="mb-1">Đạo diễn: {movie.director}</p>
              <p className="mb-1">
                Ngôn ngữ: {getCountryDisplay(movie.language)}
              </p>
              <p className="mb-1">
                Ngày phát hành:{" "}
                {new Date(movie.release_date).toLocaleDateString("vi-VN")}
              </p>
              <p className="mb-1">Thời lượng: {movie.duration} phút</p>
              <p className="mb-1">Thể loại: {movie.genre.join(", ")}</p>
              <p className="mb-1">
                Diễn viên: {movie.cast.map((a) => a.name).join(", ")}
              </p>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`mr-1 ${
                      i < Math.round((movie.average_rating || 0) / 2)
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}
                <span className="ml-2">({movie.average_rating}/10)</span>
                <span className="ml-2 text-sm text-gray-400">
                  ({movie.ratings_count} đánh giá)
                </span>
              </div>
              <p className="mb-4">{movie.description}</p>

              <h2 className="text-2xl font-bold mb-4">Rạp</h2>
              <div className="mb-4">
                {theater?.result?.theaters?.length ? (
                  <select
                    className="bg-gray-800 text-white px-4 py-2 rounded w-full md:w-1/2"
                    value={selectedTheaterId || ""}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedTheaterId(selectedId);
                      fetchShowtimesByTheater(selectedId);
                    }}
                  >
                    <option value="">-- Chọn rạp --</option>
                    {theater.result.theaters.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-gray-400">Chưa có rạp nào.</div>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-4">Suất chiếu</h2>
              <div className="mb-4">
                {showtimes.length ? (
                  <div className="flex flex-wrap gap-2">
                    {showtimes.map((showtime) => {
                      const isSelected = selectedShowtimeId === showtime._id;
                      const date = new Date(showtime.start_time);
                      const time = `${date.toLocaleDateString("vi-VN", {
                        weekday: "short",
                      })}, ${date.toLocaleDateString(
                        "vi-VN"
                      )} - ${date.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`;
                      return (
                        <button
                          key={showtime._id}
                          onClick={() => {
                            setSelectedShowtimeId(showtime._id);
                            setSelectScreenId(showtime.screen_id);
                          }}
                          className={`cursor-pointer px-4 py-2 rounded text-sm font-medium transition ${
                            isSelected
                              ? "bg-orange-500 text-white hover:bg-orange-600"
                              : "border border-orange-500 text-white hover:bg-orange-100"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-gray-400">Chưa có suất chiếu nào.</div>
                )}
              </div>

              <div className="mt-4 mr-10 justify-end flex">
                {userId ? (
                  <Button
                    onClick={() =>
                      selectedShowtimeId &&
                      navigate(`/booking/${selectScreenId}`)
                    }
                    disabled={!selectedShowtimeId}
                    className="flex justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Đăng nhập để đặt vé
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="mt-10 bg-gray-900/90 text-white rounded-[30px] p-6">
            <h2 className="text-2xl font-bold mb-4">Đánh giá phim</h2>
            {userId && (
              <div className="mb-6">
                <p className="mb-2 font-semibold">Chọn sao đánh giá:</p>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className={`cursor-pointer text-2xl ${
                        i < rating ? "text-yellow-400" : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Viết đánh giá của bạn tại đây..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-2">
                  Gửi đánh giá
                </Button>
              </div>
            )}
            <h3 className="text-xl font-semibold mt-6">
              Phản hồi từ người xem:
            </h3>
            {feedbacks.length ? (
              feedbacks.map((fb, idx) => (
                <FeedbackItem key={idx} feedback={fb} />
              ))
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Chưa có đánh giá nào.
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
