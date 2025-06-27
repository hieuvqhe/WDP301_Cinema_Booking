import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { Movie } from "../../types/Movie.type";
import type { Showtime } from "../../types/Showtime.type";
import type { GetTheatersResponse } from "../../types/Theater.type";
import { getMovieById } from "../../apis/movie.api";
import { getTheaters } from "../../apis/theater.api";
import { getShowtimeByMovieIdAndTheaterId } from "../../apis/showtime.api";
import { useAuthAction } from "../../hooks/useAuthAction";
import LoginModal from "../../components/user/LoginModal";
import MovieInfo from "./components/MovieInfo";
import FeedbackSection from "./components/FeedbackSection";

type SelectedInfo = {
  movieId: string;
  theaterId: string | null;
  showtimeId: string | null;
  screenId: string | null;
  rating: number;
  comment: string;
};

export default function MovieDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theater, setTheater] = useState<GetTheatersResponse | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>({
    movieId: id,
    theaterId: null,
    showtimeId: null,
    screenId: null,
    rating: 0,
    comment: "",
  });
  const [feedbacks, setFeedbacks] = useState([
    {
      user: { email: "nguyenvana@gmail.com" },
      comment: "Phim rất hay, kỹ xảo đẹp mắt!",
      rating: 5,
    },
    {
      user: { email: "" },
      comment: "Kịch bản hơi chậm, nhưng tổng thể ổn.",
      rating: 3,
    },
  ]);
  const navigate = useNavigate();
  const { requireAuth, showLoginModal, setShowLoginModal } = useAuthAction();

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
      const data = await getShowtimeByMovieIdAndTheaterId(id, theaterId);
      setShowtimes(data);
    } catch {
      setShowtimes([]);
    }
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

  const handleSubmitFeedback = () => {
    requireAuth(() => {
      console.log("Submit feedback:", {
        rating: selectedInfo.rating,
        comment: selectedInfo.comment,
        movieId: id,
      });
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
          </div>
          <MovieInfo
            movie={movie}
            theater={theater}
            selectedInfo={selectedInfo}
            setSelectedInfo={setSelectedInfo}
            showtimes={showtimes}
            fetchShowtimesByTheater={fetchShowtimesByTheater}
            handleBookSeats={handleBookSeats}
            userId={userId}
          />
        </motion.div>
        <FeedbackSection
          userId={userId}
          selectedInfo={selectedInfo}
          setSelectedInfo={setSelectedInfo}
          feedbacks={feedbacks}
          handleSubmitFeedback={handleSubmitFeedback}
        />
      </div>

      {showLoginModal && <LoginModal isFormOpen={setShowLoginModal} />}
    </div>
  );
}
