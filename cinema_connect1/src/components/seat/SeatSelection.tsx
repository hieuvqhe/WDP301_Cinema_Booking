import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Seat } from "../../types/Screen.type";
import { useAuthAction } from "../../hooks/useAuthAction";
import LoginModal from "../user/LoginModal";

type Props = {
  seatLayout: Seat[][];
  showConfirmButton?: boolean;
  onSelectSeat?: () => void;
};

export default function SeatSelection({
  seatLayout,
  showConfirmButton = true,
  onSelectSeat,
}: Props) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();
  const { requireAuth, showLoginModal, setShowLoginModal } = useAuthAction();

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
    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.includes(key);
      const newSelection = isAlreadySelected
        ? prev.filter((s) => s !== key)
        : [...prev, key];

      if (!isAlreadySelected && prev.length === 0 && onSelectSeat) {
        onSelectSeat();
      }

      return newSelection;
    });
  };

  const handleCheckout = () => {
    requireAuth(() => {
      navigate("/checkout");
    });
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
    <motion.div
      className="flex flex-col gap-6 items-center text-gray-300"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {seatLayout.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="flex gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: rowIndex * 0.05 }}
        >
          {row.map((seat, i) => {
            const key = `${seat.row}${seat.number}`;
            const isSelected = selectedSeats.includes(key);
            const isDisabled = seat.status !== "active";

            return (
              <motion.button
                key={key}
                disabled={isDisabled}
                onClick={() => toggleSeat(seat)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: isDisabled ? 1 : 1.1 }}
                className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center
                  border border-gray-600 transition
                  ${getSeatColor(seat.type, isSelected, isDisabled)}
                `}
              >
                {seat.row}
                {seat.number}
              </motion.button>
            );
          })}
        </motion.div>
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
          {[
            ["Regular", "bg-blue-600"],
            ["Premium", "bg-purple-600"],
            ["Recliner", "bg-pink-600"],
            ["Couple", "bg-yellow-600"],
            ["Ghế đang chọn", "bg-green-500"],
            ["Không khả dụng", "bg-gray-600"],
          ].map(([label, color], i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className={`w-5 h-5 ${color} rounded-sm`} /> {label}
            </motion.div>
          ))}
        </div>
      </div>

      {showConfirmButton && selectedSeats.length > 0 && (
        <motion.button
          onClick={handleCheckout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold"
        >
          Thanh toán ({selectedSeats.length} ghế)
        </motion.button>
      )}

      {showLoginModal && <LoginModal isFormOpen={setShowLoginModal} />}
    </motion.div>
  );
}
