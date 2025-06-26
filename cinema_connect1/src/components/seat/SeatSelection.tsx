import type { Seat } from "../../types/Screen.type";
import { useState } from "react";

type Props = {
  seatLayout: Seat[][];
};

export default function SeatSelection({ seatLayout }: Props) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seat: Seat) => {
    const key = `${seat.row}${seat.number}`;
    setSelectedSeats((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const getSeatColor = (type: string, isSelected: boolean, isDisabled: boolean) => {
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
      {/* Sơ đồ ghế */}
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

      {/* Ghế đã chọn */}
      <div className="mt-4 text-center">
        <h3 className="font-semibold text-base mb-1">Ghế đã chọn</h3>
        <p className="text-sm text-gray-400">
          {selectedSeats.length ? selectedSeats.join(", ") : "Chưa chọn"}
        </p>
      </div>

      {/* Ghi chú loại ghế */}
      <div className="mt-6 text-sm space-y-2">
        <h3 className="font-semibold text-base">Chú thích loại ghế:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded-sm" /> Regular
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-600 rounded-sm" /> Premium
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-pink-600 rounded-sm" /> Recliner
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-600 rounded-sm" /> Couple
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-sm" /> Ghế đang chọn
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-600 rounded-sm" /> Không khả dụng
          </div>
        </div>
      </div>
    </div>
  );
}
