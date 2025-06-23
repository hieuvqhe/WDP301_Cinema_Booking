import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import type { Movie } from "../../types/Movie.type";
import { getMovieById } from "../../apis/movie.api";
import { getCountryDisplay } from "../../const/language";

export default function MovieDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [feedbacks, setFeedbacks] = useState([
    {
      user: { email: "nguyenvana@gmail.com" },
      comment: "Phim rất hay, kỹ xảo đẹp mắt!",
      rating: 5,
      createdAt: "2025-06-21T12:00:00Z",
    },
    {
      user: { email: "lethi.b@gmail.com" },
      comment: "Kịch bản hơi chậm, nhưng tổng thể ổn.",
      rating: 3,
      createdAt: "2025-06-22T14:30:00Z",
    },
  ]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Lấy thông tin userId từ localStorage thông qua auth-storage
  const authStorage = localStorage.getItem("auth-storage");
  const userId = authStorage ? JSON.parse(authStorage).state.user._id : null;

  const navigate = useNavigate();

  // Gọi API để lấy thông tin phim khi component được mount hoặc khi id thay đổi
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieById(id);
        setMovie(movieData);
      } catch {
        setMovie(null); // Xử lý khi lỗi xảy ra
      }
    };
    fetchMovie();
  }, [id]);
  // const handleSubmitFeedback = async () => {
  //   if (!comment || rating === 0) return alert("Vui lòng nhập đủ thông tin");
  //   try {
  //     await postMovieFeedback(id, userId, comment, rating);
  //     setComment("");
  //     setRating(0);
  //     const res = await getMovieFeedbacks(id);
  //     setFeedbacks(res); // Cập nhật lại danh sách feedback
  //   } catch (err) {
  //     console.error("Lỗi gửi đánh giá:", err);
  //   }
  // };
  

  // Hiển thị màn hình loading khi chưa có dữ liệu phim
  if (!movie) {
    return (
      <MainLayout>
        <div className="text-center text-white mt-10">
          Đang tải thông tin phim...
        </div>
      </MainLayout>
    );
  }

  // Render chi tiết phim
  return (
    <MainLayout>
      <div
        className="relative min-h-screen bg-contain bg-center text-white"
        style={{ backgroundImage: `url(${movie.poster_url})` }} // Ảnh nền là poster phim
      >
        <div className="absolute inset-0 bg-black opacity-50" />{" "}
        {/* Lớp phủ làm tối nền */}
        <div className="relative z-10 p-6 max-w-6xl mx-auto pt-20 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 bg-gray-900/90 p-6 rounded-[30px]"
          >
            {/* Cột hiển thị poster */}
            <div className="flex flex-col items-center">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="rounded w-full"
              />
            </div>

            {/* Cột hiển thị nội dung */}
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
              <p className="mb-1">Diễn viên: {movie.cast?.join(", ")}</p>

              {/* Hiển thị đánh giá trung bình bằng sao */}
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

              {/* Nút chuyển trang: nếu đã đăng nhập thì sang bước tiếp theo, nếu chưa thì yêu cầu đăng nhập */}
              <div className="mt-4 mr-10 justify-end flex">
                {userId ? (
                  <Button
                    className="flex justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      // TODO: Chuyển sang trang đặt vé hoặc chọn suất chiếu
                    }}
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

                <Button
                  // onClick={handleSubmitFeedback}
                  className="flex justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Gửi đánh giá
                </Button>
              </div>
            )}

            <h3 className="text-xl font-semibold mt-6">
              Phản hồi từ người xem:
            </h3>
            {feedbacks.length > 0 ? (
              feedbacks.map((fb: any, index) => (
                <div key={index} className="border-b py-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < fb.rating ? "text-yellow-400" : "text-gray-400"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {fb.user?.email || "Ẩn danh"}
                    </span>
                  </div>
                  <p className="text-sm">{fb.comment}</p>
                </div>
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
