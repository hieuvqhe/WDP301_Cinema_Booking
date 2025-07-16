/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
interface SeatData {
  seats: string[];
  screenId: string;
  movieId: string;
  showtimeId: string;
  bookingId: string;
  totalAmount: number;
  theaterId?: string;
  timestamp: number;
  expiresAt: number;
}

const STORAGE_KEY = "selected-movie-info";
const SEAT_EXPIRATION_TIME = 5 * 60 * 1000;

export const useSeatPersistence = () => {
  const [seatData, setSeatData] = useState<SeatData | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<any>(null);

  // Load seat data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();

        // Check if data has expired
        if (data.expiresAt && now > data.expiresAt) {
          clearSeatData();
          setIsExpired(true);
          return;
        }

        // If no expiration time, add it
        if (!data.expiresAt) {
          data.expiresAt = now + SEAT_EXPIRATION_TIME;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        setSeatData(data);
      } catch (error) {
        console.error("Error parsing seat data:", error);
        clearSeatData();
      }
    }
  }, []);

  // Set up expiration timer
  useEffect(() => {
    if (seatData && seatData.expiresAt) {
      const now = Date.now();
      const timeUntilExpiration = seatData.expiresAt - now;

      if (timeUntilExpiration > 0) {
        intervalRef.current = setTimeout(() => {
          setIsExpired(true);
          clearSeatData();
        }, timeUntilExpiration);
      } else {
        setIsExpired(true);
        clearSeatData();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [seatData]);

  const saveSeatData = (data: Omit<SeatData, "timestamp" | "expiresAt">) => {
    const now = Date.now();
    const fullData: SeatData = {
      ...data,
      timestamp: now,
      expiresAt: now + SEAT_EXPIRATION_TIME,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
    setSeatData(fullData);
    setIsExpired(false);
  };

  const updateSeats = useCallback((seats: string[]) => {
    setSeatData((currentData) => {
      if (currentData) {
        const updatedData = {
          ...currentData,
          seats,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        return updatedData;
      }
      return currentData;
    });
  }, []);

  const updateTotalAmount = useCallback((totalAmount: number) => {
    setSeatData((currentData) => {
      if (currentData) {
        const updatedData = {
          ...currentData,
          totalAmount,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        return updatedData;
      }
      return currentData;
    });
  }, []);

  const updateBookingId = useCallback((bookingId: string) => {
    setSeatData((currentData) => {
      if (currentData) {
        const updatedData = {
          ...currentData,
          bookingId,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        return updatedData;
      }
      return currentData;
    });
  }, []);

  const clearSeatData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSeatData(null);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const extendExpiration = useCallback(
    (additionalTime: number = SEAT_EXPIRATION_TIME) => {
      setSeatData((currentData) => {
        if (currentData) {
          const now = Date.now();
          const updatedData = {
            ...currentData,
            expiresAt: now + additionalTime,
            timestamp: now,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
          return updatedData;
        }
        return currentData;
      });
    },
    []
  );

  const getTimeRemaining = (): number => {
    if (!seatData || !seatData.expiresAt) return 0;
    const now = Date.now();
    return Math.max(0, Math.floor((seatData.expiresAt - now) / 1000));
  };

  // Cleanup on beforeunload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only prevent unload if user has selected seats and is not going to checkout
      if (
        seatData &&
        seatData.seats.length > 0 &&
        !window.location.pathname.includes("/checkout")
      ) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [seatData]);

  return {
    seatData,
    isExpired,
    saveSeatData,
    updateSeats,
    updateTotalAmount,
    updateBookingId,
    clearSeatData,
    extendExpiration,
    getTimeRemaining,
  };
};
