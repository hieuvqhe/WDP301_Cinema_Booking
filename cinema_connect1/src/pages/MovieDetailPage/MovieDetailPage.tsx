import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import type { Movie } from "../../types/Movie.type";
import { getMovieById } from "../../apis/movie.api";
import { getCountryDisplay } from "../../const/language";
import type { Showtime } from "../../types/Showtime.type";
import { getShowtimeByMovieIdAndTheaterId } from "../../apis/showtime.api";
import { getTheaters } from "../../apis/theater.api";
import type { GetTheatersResponse } from "../../types/Theater.type";
import { useAuthAction } from "../../hooks/useAuthAction";
import LoginModal from "../../components/user/LoginModal";
import ReactPlayer from "react-player";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type SelectedInfo = {
  movieId: string;
  theaterId: string | null;
  showtimeId: string | null;
  screenId: string | null;
  rating: number;
  comment: string;
};

function FeedbackItem({ feedback }: { feedback: any }) {
  return (
    <div className="border-b border-gray-700 py-3">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${
              i < feedback.rating ? "text-yellow-400" : "text-gray-500"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-400">
          {feedback.user?.email || "Ẩn danh"}
        </span>
      </div>
      <p className="text-sm text-gray-300">{feedback.comment}</p>
    </div>
  );
}

export default function MovieDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [theater, setTheater] = useState<GetTheatersResponse | null>(null);
  const navigate = useNavigate();
  const { requireAuth, showLoginModal, setShowLoginModal } = useAuthAction();
  const [isPlayTrailer, setIsPlayTrailer] = useState(false);

  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>({
    movieId: id,
    theaterId: null,
    showtimeId: null,
    screenId: null,
    rating: 0,
    comment: "",
  });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };

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

  let userId: string | null = null;
  try {
    const authStorage = localStorage.getItem("auth-storage");
    userId = authStorage ? JSON.parse(authStorage).state.user._id : null;
  } catch {
    userId = null;
  }

  useEffect(() => {
    localStorage.setItem("selected-movie-info", JSON.stringify(selectedInfo));
  }, [selectedInfo]);

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

    const fetchTheater = async () => {
      try {
        const theaterData = await getTheaters();
        setTheater(theaterData);
        const firstId = theaterData.result?.theaters?.[0]?._id;
        if (firstId) {
          setSelectedInfo((prev) => ({
            ...prev,
            theaterId: firstId,
          }));
          fetchShowtimesByTheater(firstId);
        }
      } catch {
        setTheater(null);
      }
    };

    const stored = localStorage.getItem("selected-movie-info");
    if (stored) {
      const data = JSON.parse(stored);
      setSelectedInfo({
        movieId: id,
        theaterId: data.theaterId || null,
        showtimeId: data.showtimeId || null,
        screenId: data.screenId || null,
        rating: data.rating || 0,
        comment: data.comment || "",
      });
    }

    fetchMovie();
    fetchTheater();
  }, [id]);

  const fetchShowtimesByTheater = async (theaterId: string) => {
    try {
      if (!id) return;
      const data = await getShowtimeByMovieIdAndTheaterId(id, theaterId);
      setShowtimes(data);
    } catch {
      setShowtimes([]);
    }
  };

  const handleSubmitFeedback = () => {
    requireAuth(() => {
      // Logic submit feedback ở đây
      console.log("Submitting feedback:", {
        rating: selectedInfo.rating,
        comment: selectedInfo.comment,
        movieId: id,
      });
      // Có thể gọi API submit feedback ở đây
      // submitFeedback({ movieId: id, rating: selectedInfo.rating, comment: selectedInfo.comment });
    });
  };

  const handleBookSeats = () => {
    requireAuth(() => {
      if (
        selectedInfo.theaterId &&
        selectedInfo.showtimeId &&
        selectedInfo.screenId
      ) {
        navigate(`/movies/${id}/${selectedInfo.screenId}`);
      }
    });
  };

  if (!movie) {
    return (
      <div className="text-center text-gray-300 mt-10">
        Đang tải thông tin phim...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#121212] text-gray-300 overflow-x-hidden">
      <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-44 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 bg-[#1E1E1E] p-6 rounded-3xl shadow-xl"
        >
          <div className="flex flex-col items-center">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="rounded w-full"
            />

            <button
              className="px-3 py-1 bg-primary rounded-lg mt-4 hover:bg-primary/70 transition-colors duration-200"
              onClick={() => setIsPlayTrailer(true)}
            >
              <p>Watch Trailer</p>
            </button>
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
            {/* <p className="mb-1">Diễn viên:</p>
            <Slider {...settings}>
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
            </Slider> */}

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

            <h2 className="text-2xl font-bold mb-4">Rạp</h2>
            <div className="mb-4">
              {theater?.result?.theaters?.length ? (
                <select
                  className="bg-[#2A2A2A] text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedInfo.theaterId || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedInfo((prev) => ({
                      ...prev,
                      theaterId: selectedId,
                      showtimeId: null,
                      screenId: null,
                    }));
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
                    const isSelected = selectedInfo.showtimeId === showtime._id;
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
                        onClick={() =>
                          setSelectedInfo((prev) => ({
                            ...prev,
                            showtimeId: showtime._id,
                            screenId: showtime.screen_id,
                          }))
                        }
                        className={`cursor-pointer px-4 py-2 rounded text-sm font-medium transition ${
                          isSelected
                            ? "bg-primary text-white hover:bg-primary-dull"
                            : "border border-primary text-white hover:bg-[#1E1E1E]"
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

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleBookSeats}
                disabled={!selectedInfo.showtimeId}
                className="px-4 py-2 text-xs text-white bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 bg-[#1E1E1E] text-gray-300 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">Đánh giá phim</h2>
          {userId && (
            <div className="mb-6">
              <p className="mb-2 font-semibold">Chọn sao đánh giá:</p>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    onClick={() =>
                      setSelectedInfo((prev) => ({ ...prev, rating: i + 1 }))
                    }
                    className={`cursor-pointer text-2xl ${
                      i < selectedInfo.rating
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <textarea
                className="w-full p-3 border border-gray-700 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Viết đánh giá của bạn tại đây..."
                value={selectedInfo.comment}
                onChange={(e) =>
                  setSelectedInfo((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              />
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 text-xs text-white bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi đánh giá
              </button>
            </div>
          )}
          <h3 className="text-xl font-semibold mt-6">Phản hồi từ người xem:</h3>
          {feedbacks.length ? (
            feedbacks.map((fb, idx) => <FeedbackItem key={idx} feedback={fb} />)
          ) : (
            <p className="text-sm text-gray-500 mt-2">Chưa có đánh giá nào.</p>
          )}
        </div>
      </div>

      {showLoginModal && <LoginModal isFormOpen={setShowLoginModal} />}
      {isPlayTrailer && (
        <div
          className="fixed inset-0 bg-black/70 background-blur-lg z-50 
        flex items-center justify-center p-4w-full h-screen"
          onClick={() => setIsPlayTrailer(false)}
        >
          <div className="w-fit h-fit border border-primary rounded-sm">
            <ReactPlayer
              url={movie.trailer_url}
              controls={false}
              playing={true}
              className="mx-auto max-w-full"
              width={"960px"}
              height={"540px"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
