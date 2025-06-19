import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import type { Movie } from "../../types/Movie.type";
import { getMovieById } from "../../apis/movie.api";

export default function MovieDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
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
        className="relative min-h-screen bg-contain bg-center text-white"
        style={{ backgroundImage: `url(${movie.poster_url})` }}
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
              <Button
                className="mt-4 bg-transparent border-2 border-orange-500 hover:bg-orange-600 text-orange-500 hover:text-white px-8 py-3 text-lg"
                onClick={() => setShowTrailer(true)}
              >
                Trailer
              </Button>
            </div>
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <p className="mb-1">Đạo diễn: {movie.director}</p>
              <p className="mb-1">
                Ngôn ngữ: {movie.language}
              </p>
              <p className="mb-1">
                Ngày phát hành: {new Date(movie.release_date).toLocaleDateString("vi-VN")}
              </p>
              <p className="mb-1">Thời lượng: {movie.duration} phút</p>
              <p className="mb-1">Thể loại: {movie.genre.join(", ")}</p>
              <p className="mb-1">Diễn viên: {movie.cast?.join(", ")}</p>
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
                <span className="ml-2 text-sm text-gray-400">({movie.ratings_count} đánh giá)</span>
              </div>
              <p className="mb-4">{movie.description}</p>
              <div className="mt-4 mr-10 justify-end flex">
                {userId ? (
                  <Button
                    className="flex justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {/* Chuyển sang trang đặt vé hoặc showtimes */}}
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button
                    className="flex justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập để đặt vé
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        {/* <Modal open={showTrailer} onOpenChange={setShowTrailer}>
          <div className="bg-gray-900 p-4 rounded-xl w-full max-w-3xl mx-auto">
            <h2 className="text-xl text-white mb-4">{movie.title} - Trailer</h2>
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe
                src={movie.trailer_url || ""}
                allowFullScreen
                title="Movie Trailer"
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </Modal> */}
      </div>
    </MainLayout>
  );
}
