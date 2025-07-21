/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getScreenById } from "../../apis/screen.api";
import type { Screen } from "../../types/Screen.type";
import { useSeatPersistence } from "../../hooks/useSeatPersistence";
import SeatSelection from "../../components/seat/SeatSelection";

export default function SeatLayout() {
  const { screenId, id } = useParams<{ screenId: string; id: string }>();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null); // null = chưa bắt đầu
  const navigate = useNavigate();
  const { getTimeRemaining, isExpired, clearSeatData, seatData, saveSeatData } = useSeatPersistence();

  // Initialize seat data from localStorage if not exists
  useEffect(() => {
    if (!seatData && screenId && id) {
      // Check if we have data from MovieDetailPage
      const storedInfo = localStorage.getItem("selected-movie-info");
      if (storedInfo) {
        const parsed = JSON.parse(storedInfo);
        if (parsed.movieId && parsed.showtimeId && parsed.screenId && parsed.theaterId) {
          saveSeatData({
            seats: [],
            screenId: parsed.screenId,
            movieId: parsed.movieId,
            showtimeId: parsed.showtimeId,
            totalAmount: 0,
            theaterId: parsed.theaterId,
          });
        }
      }
    }
  }, [seatData, screenId, id, saveSeatData]);

  // ⏳ Sync with persistence hook timer
  useEffect(() => {
    if (isExpired) {
      clearSeatData();
      navigate(`/movies/${id}`);
      return;
    }

    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        navigate(`/movies/${id}`);
      }
    }, 1000);

    // Set initial time
    setSecondsLeft(getTimeRemaining());

    return () => clearInterval(interval);
  }, [isExpired, getTimeRemaining, navigate, id, clearSeatData]);

  const startTimer = () => {
    if (secondsLeft === null) {
      const remaining = getTimeRemaining();
      setSecondsLeft(remaining > 0 ? remaining : 600); // 10 phút hoặc thời gian còn lại
    }
  };

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
          {/* {secondsLeft !== null && (
            <div className="text-lg font-semibold text-red-400">
              Thời gian giữ ghế: {formatTime(secondsLeft)}
            </div>
          )} */}
        </div>
        <SeatSelection
          seatLayout={screen.seat_layout}
          onSelectSeat={startTimer}
        />
      </div>
    </div>
  );
}
