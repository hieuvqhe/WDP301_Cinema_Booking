/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Seat } from "../../types/Screen.type";
import type { LockedSeat } from "../../types/Showtime.type";
import { useAuthAction } from "../../hooks/useAuthAction";
import { useAuthStore } from "../../store/useAuthStore";
import LoginModal from "../user/LoginModal";
import {
  getShowtimeById,
  getShowtimeByIdLockedSeats,
} from "../../apis/showtime.api";

type priceType = {
  regular: number;
  premium: number;
  recliner: number;
  couple: number;
};

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
  const [price, setPrice] = useState<priceType | null>(null);
  const [lockedSeats, setLockedSeats] = useState<LockedSeat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});
  const [isRefetching, setIsRefetching] = useState(false);
  const navigate = useNavigate();
  const { requireAuth, showLoginModal, setShowLoginModal } = useAuthAction();
  const { user } = useAuthStore();

  // Lấy ghế đã chọn từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selected-movie-info");
    if (stored) {
      const data = JSON.parse(stored);
      if (Array.isArray(data.seats)) {
        setSelectedSeats(data.seats);
      }
    }
  }, []);

  // Cập nhật seats đã chọn vào localStorage
  useEffect(() => {
    const prevData = localStorage.getItem("selected-movie-info");
    const parsed = prevData ? JSON.parse(prevData) : {};
    localStorage.setItem(
      "selected-movie-info",
      JSON.stringify({ ...parsed, seats: selectedSeats })
    );
  }, [selectedSeats]);

  // Fetch seat data function
  const fetchSeatData = async () => {
    const data = localStorage.getItem("selected-movie-info");
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.showtimeId) {
        setIsRefetching(true);
        try {
          const [showtime, locked] = await Promise.all([
            getShowtimeById(parsed.showtimeId),
            getShowtimeByIdLockedSeats(parsed.showtimeId),
          ]);

          setPrice(showtime.price);
          setLockedSeats(locked);

          // Initialize countdowns for locked seats
          const newCountdowns: Record<string, number> = {};
          const userLockedSeats: string[] = [];

          locked.forEach((seat) => {
            const key = `${seat.row}${seat.number}`;
            const expiresAt = new Date(seat.expires_at).getTime();
            const now = new Date().getTime();
            const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
            newCountdowns[key] = remaining;

            // Auto-select seats locked by current user
            if (user && seat.user_id === user._id) {
              userLockedSeats.push(key);
            }
          });

          setCountdowns(newCountdowns);

          // Add user's locked seats to selected seats
          if (userLockedSeats.length > 0) {
            setSelectedSeats((prev) => {
              const newSelection = [...new Set([...prev, ...userLockedSeats])];
              // Update localStorage
              const prevData = localStorage.getItem("selected-movie-info");
              const parsed = prevData ? JSON.parse(prevData) : {};
              localStorage.setItem(
                "selected-movie-info",
                JSON.stringify({ ...parsed, seats: newSelection })
              );
              return newSelection;
            });
          }

          // Xử lý booked_seats, loại trừ locked seats
          if (showtime.booked_seats) {
            const lockedSeatKeys = locked.map(
              (seat) => `${seat.row}${seat.number}`
            );
            const bookedSeatKeys = showtime.booked_seats
              .map((seat: any) => `${seat.row}${seat.number}`)
              .filter((seatKey: string) => !lockedSeatKeys.includes(seatKey));
            setBookedSeats(bookedSeatKeys);
          }
        } catch (error) {
          console.error("Failed to fetch showtime data:", error);
        } finally {
          setIsRefetching(false);
        }
      }
    }
  };

  // Lấy giá tiền và ghế đã đặt từ showtimeId
  useEffect(() => {
    fetchSeatData();
  }, []);

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
    isDisabled: boolean,
    isLocked: boolean,
    isBooked: boolean,
    isUserLocked: boolean
  ) => {
    if (isBooked) return "bg-red-600 text-white cursor-not-allowed";
    if (isUserLocked) return "bg-green-500 text-white hover:bg-green-600"; // User's locked seats appear as selected
    if (isLocked) return "bg-yellow-600 text-white cursor-not-allowed"; // Others' locked seats appear as yellow
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

  // ✅ Tính tổng tiền ghế đã chọn theo loại ghế
  const totalAmount = selectedSeats.reduce((sum, seatKey) => {
    for (const row of seatLayout) {
      for (const seat of row) {
        const key = `${seat.row}${seat.number}`;
        if (key === seatKey && price) {
          return sum + (price[seat.type as keyof priceType] || 0);
        }
      }
    }
    return sum;
  }, 0);

  // ✅ Lưu totalAmount vào localStorage khi seats hoặc price đổi
  useEffect(() => {
    if (!price) return;

    const totalAmount = selectedSeats.reduce((sum, seatKey) => {
      for (const row of seatLayout) {
        for (const seat of row) {
          const key = `${seat.row}${seat.number}`;
          if (key === seatKey) {
            return sum + (price[seat.type as keyof priceType] || 0);
          }
        }
      }
      return sum;
    }, 0);

    const prevData = localStorage.getItem("selected-movie-info");
    const parsed = prevData ? JSON.parse(prevData) : {};
    localStorage.setItem(
      "selected-movie-info",
      JSON.stringify({ ...parsed, totalAmount })
    );
  }, [selectedSeats, price, seatLayout]);

  // Countdown timer for locked seats
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = { ...prev };
        let hasExpired = false;

        Object.keys(updated).forEach((key) => {
          if (updated[key] > 0) {
            updated[key] -= 1;
          } else if (updated[key] === 0) {
            hasExpired = true;
            delete updated[key];
          }
        });

        // Auto refresh when seats expire
        if (hasExpired) {
          setTimeout(() => fetchSeatData(), 500);
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format countdown display
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          className="flex gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: rowIndex * 0.05 }}
        >
          {row.map((seat) => {
            const key = `${seat.row}${seat.number}`;
            const isSelected = selectedSeats.includes(key);
            const isDisabled = seat.status !== "active";
            const lockedSeat = lockedSeats.find(
              (locked) => `${locked.row}${locked.number}` === key
            );
            const isLocked = !!lockedSeat;
            const isUserLocked =
              lockedSeat && user && lockedSeat.user_id === user._id;
            const isOtherUserLocked = isLocked && !isUserLocked;
            const isBooked = bookedSeats.includes(key);
            const canSelect = !isDisabled && !isOtherUserLocked && !isBooked;
            const countdown = countdowns[key];

            return (
              <motion.div key={key} className="relative mb-8">
                <motion.button
                  disabled={!canSelect}
                  onClick={() => canSelect && toggleSeat(seat)}
                  whileTap={{ scale: canSelect ? 0.9 : 1 }}
                  whileHover={{ scale: canSelect ? 1.05 : 1 }}
                  className={`w-14 h-14 rounded-lg text-base font-semibold flex items-center justify-center
                    border-2 border-gray-600 transition-all duration-200 shadow-lg
                    ${getSeatColor(
                      seat.type,
                      isSelected,
                      isDisabled,
                      isOtherUserLocked,
                      isBooked,
                      !!isUserLocked
                    )}
                  `}
                >
                  <span className="flex flex-col items-center leading-tight">
                    <span className="text-xs">{seat.row}</span>
                    <span className="text-sm">{seat.number}</span>
                  </span>
                </motion.button>
                {isLocked && countdown !== undefined && countdown > 0 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium shadow-lg ${
                      isUserLocked 
                        ? "bg-green-600 text-white" 
                        : "bg-yellow-600 text-white"
                    }`}>
                      <div className="flex items-center gap-1">
                        {isUserLocked && (
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        )}
                        <span>{formatCountdown(countdown)}</span>
                      </div>
                      {isUserLocked && (
                        <div className="text-center text-xs opacity-90">Của bạn</div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      ))}

      <div className="mt-8 text-center">
        <h3 className="font-semibold text-lg mb-2">Ghế đã chọn</h3>
        <p className="text-base text-gray-400 mb-4">
          {selectedSeats.length ? selectedSeats.join(", ") : "Chưa chọn"}
        </p>
        <h3 className="font-semibold text-lg mt-6 mb-2">
          Số tiền cần thanh toán:
        </h3>
        <p className="text-2xl font-bold text-green-500">
          {price ? totalAmount.toLocaleString("vi-VN") : "0"} VNĐ
        </p>
      </div>

      <div className="mt-8 text-sm space-y-3">
        <h3 className="font-semibold text-lg">Chú thích loại ghế:</h3>
        <div className="flex flex-wrap gap-6 justify-center">
          {[
            ["Regular", "bg-blue-600"],
            ["Premium", "bg-purple-600"],
            ["Recliner", "bg-pink-600"],
            ["Couple", "bg-yellow-600"],
            ["Ghế đang chọn", "bg-green-500"],
            ["Ghế đã đặt", "bg-red-600"],
            ["Ghế của bạn đang khóa", "bg-green-500"],
            ["Ghế khác đang khóa", "bg-yellow-600"],
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

      <div className="flex flex-col gap-4 items-center">
        <motion.button
          onClick={fetchSeatData}
          disabled={isRefetching}
          whileHover={{ scale: isRefetching ? 1 : 1.05 }}
          whileTap={{ scale: isRefetching ? 1 : 0.95 }}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            isRefetching
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isRefetching ? "Đang tải..." : "Làm mới ghế"}
        </motion.button>

        {showConfirmButton && selectedSeats.length > 0 && (
          <motion.button
            onClick={handleCheckout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold"
          >
            Thanh toán ({selectedSeats.length} ghế)
          </motion.button>
        )}
      </div>

      {showLoginModal && <LoginModal isFormOpen={setShowLoginModal} />}
    </motion.div>
  );
}
