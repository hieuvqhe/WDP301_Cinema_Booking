import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getScreenById } from "../../apis/screen.api";
import type { Screen } from "../../types/Screen.type";
import SeatSelection from "../../components/seat/SeatSelection";

export default function SeatLayout() {
  const { screenId } = useParams<{ screenId: string }>();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-3xl font-bold text-center mb-6">{screen.name}</h1>
        <SeatSelection seatLayout={screen.seat_layout} />
      </div>
    </div>
  );
}
