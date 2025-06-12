import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../store/useAuthStore";
import MainLayout from "../../components/layout/MainLayout";
import {
  Play,
  Star,
  Clock,
  Calendar,
  MapPin,
  Ticket,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const movies = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      rating: 9.2,
      duration: "192 phút",
      genre: "Sci-Fi, Adventure",
      showtime: "14:30, 17:45, 20:00",
      price: "120,000đ",
    },
    {
      id: 2,
      title: "Black Panther: Wakanda Forever",
      poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
      rating: 8.5,
      duration: "161 phút",
      genre: "Action, Drama",
      showtime: "15:00, 18:15, 21:30",
      price: "130,000đ",
    },
  ];

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "action", name: "Hành động" },
    { id: "drama", name: "Chính kịch" },
    { id: "comedy", name: "Hài kịch" },
  ];

  const handleBookTicket = (movieId: number) => {
    navigate(`/booking/${movieId}`);
  };
  return (
    <MainLayout>
      <section
        className="min-h-screen bg-gradient-to-b from-violet-900 to-black flex xl:flex-row
    flex-col-reverse items-center justify-between lg:px-24 px-10 relative
    overflow-hidden gap-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Chào mừng đến với{" "}
              <span className="text-orange-400">Cinema Connect</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Đặt vé xem phim dễ dàng, trải nghiệm điện ảnh tuyệt vời
            </p>
            {user && (
              <div className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-full text-sm mb-6">
                <span>Xin chào, {user.name}!</span>
                <span className="ml-2 bg-green-700 px-2 py-1 rounded-full text-xs">
                  {user.role.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/movies")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              >
                <Ticket className="mr-2" size={20} />
                Đặt vé ngay
              </Button>
              <Button
                onClick={() => navigate("/showtimes")}
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 text-lg"
              >
                <Calendar className="mr-2" size={20} />
                Xem lịch chiếu
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tìm phim..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Filter size={16} className="mr-2" />
                Lọc
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="mr-3 text-orange-400" size={28} />
              Phim đang hot
            </h2>
            <Button
              onClick={() => navigate("/movies")}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              Xem tất cả
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => handleBookTicket(movie.id)}
                      className="bg-orange-500 hover:bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Play size={16} className="mr-2" />
                      Đặt vé
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded flex items-center">
                    <Star size={14} className="text-yellow-400 mr-1" />
                    <span className="text-sm">{movie.rating}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{movie.genre}</p>

                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <Clock size={14} className="mr-1" />
                    <span>{movie.duration}</span>
                    <span className="mx-2">•</span>
                    <span className="text-orange-400 font-medium">
                      {movie.price}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    <span>Lịch chiếu: {movie.showtime}</span>
                  </div>

                  <Button
                    onClick={() => handleBookTicket(movie.id)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Ticket size={16} className="mr-2" />
                    Đặt vé ngay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Đối tác rạp chiếu phim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {["CGV", "Galaxy", "Lotte", "BHD Star", "Beta", "Cinestar"].map(
              (brand) => (
                <div key={brand} className="text-center">
                  <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer">
                    <h3 className="text-white font-semibold">{brand}</h3>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
export default HomePage;
