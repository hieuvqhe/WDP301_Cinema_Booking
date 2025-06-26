import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Seat } from "../../types/Screen.type";

type Props = {
  seatLayout: Seat[][];
  showConfirmButton?: boolean;
};

export default function SeatSelection({ seatLayout, showConfirmButton = true }: Props) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("selected-movie-info");
    if (stored) {
      const data = JSON.parse(stored);
      if (Array.isArray(data.seats)) {
        setSelectedSeats(data.seats);
      }
    }
  }, []);

  useEffect(() => {
    const prevData = localStorage.getItem("selected-movie-info");
    const parsed = prevData ? JSON.parse(prevData) : {};
    localStorage.setItem(
      "selected-movie-info",
      JSON.stringify({ ...parsed, seats: selectedSeats })
    );
  }, [selectedSeats]);

  const toggleSeat = (seat: Seat) => {
    const key = `${seat.row}${seat.number}`;
    setSelectedSeats((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const getSeatColor = (
    type: string,
    isSelected: boolean,
    isDisabled: boolean
  ) => {
    if (isDisabled) return "bg-gray-600 text-gray-400 cursor-not-allowed";
    if (isSelected) return "bg-green-500 text-white hover:bg-green-600";
    switch (type) {
      case "regular":
        return "bg-blue-600 hover:bg-blue-400";
      case "premium":
        return "bg-purple-600 hover:bg-purple-400";
      case "recliner":
        return "bg-pink-600 hover:bg-pink-400";
      case "couple":
        return "bg-yellow-600 hover:bg-yellow-400";
      default:
        return "bg-gray-500 hover:bg-gray-400";
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center text-gray-300">
      {seatLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((seat) => {
            const key = `${seat.row}${seat.number}`;
            const isSelected = selectedSeats.includes(key);
            const isDisabled = seat.status !== "active";

            return (
              <button
                key={key}
                disabled={isDisabled}
                onClick={() => toggleSeat(seat)}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center
                  border border-gray-600 transition
                  ${getSeatColor(seat.type, isSelected, isDisabled)}
                `}
              >
                {seat.row}
                {seat.number}
              </button>
            );
          })}
        </div>
      ))}

      <div className="mt-4 text-center">
        <h3 className="font-semibold text-base mb-1">Ghế đã chọn</h3>
        <p className="text-sm text-gray-400">
          {selectedSeats.length ? selectedSeats.join(", ") : "Chưa chọn"}
        </p>
      </div>

      <div className="mt-6 text-sm space-y-2">
        <h3 className="font-semibold text-base">Chú thích loại ghế:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-blue-600 rounded-sm" /> Regular</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-purple-600 rounded-sm" /> Premium</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-pink-600 rounded-sm" /> Recliner</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-yellow-600 rounded-sm" /> Couple</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-green-500 rounded-sm" /> Ghế đang chọn</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-gray-600 rounded-sm" /> Không khả dụng</div>
        </div>
      </div>

      {/* ✅ Nút Thanh toán */}
      {showConfirmButton && selectedSeats.length > 0 && (
        <button
          onClick={handleCheckout}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold"
        >
          Thanh toán ({selectedSeats.length} ghế)
        </button>
      )}
    </div>
  );
}
