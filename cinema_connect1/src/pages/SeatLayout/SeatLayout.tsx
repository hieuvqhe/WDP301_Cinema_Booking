import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getScreenById } from "../../apis/screen.api";
import type { Screen } from "../../types/Screen.type";
import SeatSelection from "../../components/seat/SeatSelection";

export default function SeatLayout() {
  const { screenId, id } = useParams<{ screenId: string; id: string }>();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 phút = 600 giây
  const navigate = useNavigate();

  // ⏳ Đếm ngược thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/movies/${id}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, id]);

  // 🖥️ Lấy thông tin màn hình chiếu
  useEffect(() => {
    if (!screenId) return;

    const fetchScreen = async () => {
      try {
        const data = await getScreenById(screenId);
        setScreen(data);
      } catch (error) {
        console.error("Failed to load screen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreen();
  }, [screenId]);

  // 🧮 Format thời gian còn lại
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-gray-300 text-lg">
        Đang tải sơ đồ ghế...
      </div>
    );

  if (!screen)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-red-500 text-lg">
        Không tìm thấy màn hình.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-12">
      <div className="bg-[#1E1E1E] rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">{screen.name}</h1>
          <div className="text-lg font-semibold text-red-400">
            Thời gian giữ ghế: {formatTime(secondsLeft)}
          </div>
        </div>
        <SeatSelection seatLayout={screen.seat_layout} />
      </div>
    </div>
  );
}
