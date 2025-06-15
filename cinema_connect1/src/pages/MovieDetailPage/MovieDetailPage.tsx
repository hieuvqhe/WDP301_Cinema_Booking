import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  trailerUrl: string;
  director: string;
  year: number;
  Country: string;
  duration: number;
  description: string;
  showtimes: Record<string, string[]>;
  genre?: string;
  cast?: string[];
  rating?: number;
}

export default function MovieDetailsPage() {
  const movies: Movie[] = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      imageUrl:
        "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      trailerUrl: "https://www.youtube.com/embed/d9MyW72ELq0",
      director: "James Cameron",
      year: 2022,
      Country: "USA",
      duration: 192,
      description:
        "Jake Sully sống với gia đình mới được hình thành trên hành tinh Pandora...",
      showtimes: {
        "2025-06-12": ["14:30", "17:45", "20:00"],
        "2025-06-13": ["15:00", "18:00"],
      },
      genre: "Sci-fi, Action",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      rating: 7.8,
    },
    {
      id: 2,
      title: "Black Panther: Wakanda Forever",
      imageUrl:
        "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
      trailerUrl: "https://www.youtube.com/embed/_Z3QKkl1WyM",
      director: "Ryan Coogler",
      year: 2022,
      Country: "USA",
      duration: 161,
      description:
        "Sau cái chết của T’Challa, Wakanda đối mặt với những thế lực toàn cầu mới...",
      showtimes: {
        "2025-06-12": ["15:00", "18:15", "21:30"],
        "2025-06-13": ["16:00", "19:00"],
      },
      genre: "Action, Superhero",
      cast: ["Letitia Wright", "Angela Bassett", "Tenoch Huerta"],
      rating: 7.2,
    },
  ];

  const { id = "" } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const movieData = movies.find((m) => m.id.toString() === id);
    setMovie(movieData || null);

    if (movieData?.showtimes) {
      const firstDate = Object.keys(movieData.showtimes)[0];
      setSelectedDate(firstDate);
      setSelectedShowtime(movieData.showtimes[firstDate]?.[0] || "");
    }
  }, [id]);

  //   const handleBooking = () => {
  //     if (!movie || !selectedDate || !selectedShowtime) {
  //       alert("Vui lòng chọn đầy đủ thông tin đặt vé.");
  //       return;
  //     }

  //     const booking = {
  //       userId,
  //       movieId: id,
  //       movieTitle: movie.title,
  //       bookingDate: selectedDate,
  //       bookingTime: selectedShowtime,
  //     };

  //     try {
  //       const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
  //       localStorage.setItem("bookings", JSON.stringify([...existing, booking]));
  //       alert(`Bạn đã đặt ${seats} ghế cho phim "${movie.title}"`);
  //       navigate(`/your-booking/${userId}`);
  //     } catch (error) {
  //       console.error(error);
  //       alert("Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại.");
  //     }
  //   };

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
        style={{ backgroundImage: `url(${movie.imageUrl})` }}
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
                src={movie.imageUrl}
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
                Năm phát hành: {movie.year} - {movie.Country}
              </p>
              <p className="mb-1">Thời lượng: {movie.duration} phút</p>
              <p className="mb-1">Thể loại: {movie.genre}</p>
              <p className="mb-1">Diễn viên: {movie.cast?.join(", ")}</p>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`mr-1 ${
                      i < Math.round((movie.rating || 0) / 2)
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}
                <span className="ml-2">({movie.rating}/10)</span>
              </div>
              <p className="mb-4">{movie.description}</p>

              <div className="mt-6">
                <div className="flex space-x-3 overflow-x-auto justify-center">
                  {Object.keys(movie.showtimes).map((date) => (
                    <div
                      key={date}
                      className={`cursor-pointer h-10 px-5 pt-1.5 pb-3 rounded ${
                        selectedDate === date
                          ? "border-2 border-orange-500 bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-2 border-orange-500 hover:bg-orange-600 text-orange-500 hover:text-white"
                      }`}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedShowtime(movie.showtimes[date][0]);
                      }}
                    >
                      {new Date(date).toLocaleDateString("vi-VN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <hr className="my-4" />
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {movie.showtimes[selectedDate]?.map((time, index) => (
                    <Button
                      key={index}
                      className={`cursor-pointer h-10 px-5 pt-1.5 pb-3 rounded ${
                        selectedShowtime === time
                          ? "border-2 border-orange-500 bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-2 border-orange-500 hover:bg-orange-600 text-orange-500 hover:text-white"
                      }`}
                      onClick={() => setSelectedShowtime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-4 mr-10 justify-end flex">
                <Button
                  //onClick={handleBooking}
                  className="flex justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <Modal open={showTrailer} onOpenChange={setShowTrailer}>
          <div className="bg-gray-900 p-4 rounded-xl w-full max-w-3xl mx-auto">
            <h2 className="text-xl text-white mb-4">{movie.title} - Trailer</h2>
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe
                src={movie.trailerUrl}
                allowFullScreen
                title="Movie Trailer"
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
