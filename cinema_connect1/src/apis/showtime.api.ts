/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type {
  Showtime,
  CreateShowtimeRequest,
  UpdateShowtimeRequest,
  LockedSeat,
} from "../types/Showtime.type";

// Sử dụng biến môi trường
const showtimeApi = axios.create({
  baseURL: `https://bookmovie-5n6n.onrender.com/cinema/showtimes`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility function để lọc suất chiếu chỉ lấy những suất chiếu trong tương lai
const filterFutureShowtimes = (showtimes: Showtime[]): Showtime[] => {
  const now = new Date();
  return showtimes.filter((showtime) => {
    // Tạo DateTime từ start_time
    const showtimeDate = new Date(showtime.start_time);
    return showtimeDate > now;
  });
};

// Xử lý lỗi
const handleShowtimeError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    switch (status) {
      case 400:
        return new Error(message || "Dữ liệu không hợp lệ.");
      case 401:
        return new Error("Chưa đăng nhập.");
      case 403:
        return new Error("Không có quyền truy cập.");
      case 404:
        return new Error(message || "Không tìm thấy suất chiếu.");
      case 500:
        return new Error("Lỗi máy chủ. Vui lòng thử lại sau.");
      default:
        return new Error(message || "Yêu cầu thất bại.");
    }
  }
  return new Error("Lỗi mạng. Vui lòng kiểm tra kết nối.");
};

// Lấy tất cả showtime (chỉ suất chiếu tương lai)
export const getShowtimes = async (): Promise<Showtime[]> => {
  try {
    const res = await showtimeApi.get<{
      showtimes?: Showtime[];
      result?: { showtimes: Showtime[] };
    }>("");

    let showtimes: Showtime[] = [];
    if (res.data.showtimes) showtimes = res.data.showtimes;
    else if (res.data.result?.showtimes) showtimes = res.data.result.showtimes;

    // Lọc chỉ lấy suất chiếu tương lai
    return filterFutureShowtimes(showtimes);
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Tạo showtime mới
export const createShowtime = async (
  data: CreateShowtimeRequest
): Promise<Showtime> => {
  try {
    const res = await showtimeApi.post<{ result: Showtime }>("", data);
    return res.data.result;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Lấy theo ID
export const getShowtimeById = async (
  showtime_id: string
): Promise<Showtime> => {
  try {
    const res = await showtimeApi.get<{ result: Showtime }>(`/${showtime_id}`);
    return res.data.result;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};
export const getShowtimeByIdLockedSeats = async (
  showtime_id: string
): Promise<LockedSeat[]> => {
  try {
    const res = await showtimeApi.get<{ result: LockedSeat[] }>(
      `/${showtime_id}/locked-seats`
    );
    return res.data.result;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};
// Lấy theo movie ID (chỉ suất chiếu tương lai)
export const getShowtimeByMovieId = async (
  movie_id: string
): Promise<Showtime[]> => {
  try {
    const res = await showtimeApi.get<any>("", {
      params: { movie_id },
    });
    console.log("Showtime by movie_id response:", res.data);

    let showtimes: Showtime[] = [];
    if (res.data.showtimes) showtimes = res.data.showtimes;
    else if (res.data.result?.showtimes) showtimes = res.data.result.showtimes;

    // Lọc chỉ lấy suất chiếu tương lai
    return filterFutureShowtimes(showtimes);
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Lấy theo movie ID và theater ID (chỉ suất chiếu tương lai)
export const getShowtimeByMovieIdAndTheaterId = async (
  movie_id: string,
  theater_id: string
): Promise<Showtime[]> => {
  try {
    const res = await showtimeApi.get<any>("", {
      params: { movie_id, theater_id },
    });

    let showtimes: Showtime[] = [];
    if (res.data.showtimes) showtimes = res.data.showtimes;
    else if (res.data.result?.showtimes) showtimes = res.data.result.showtimes;

    // Lọc chỉ lấy suất chiếu tương lai
    return filterFutureShowtimes(showtimes);
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Cập nhật
export const updateShowtime = async (
  showtime_id: string,
  data: UpdateShowtimeRequest
): Promise<Showtime> => {
  try {
    const res = await showtimeApi.put<{ result: Showtime }>(
      `/${showtime_id}`,
      data
    );
    return res.data.result;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Xoá
export const deleteShowtime = async (
  showtime_id: string
): Promise<{ message: string }> => {
  try {
    const res = await showtimeApi.delete<{ message: string }>(
      `/${showtime_id}`
    );
    return res.data;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Lấy danh sách ghế đã khoá
export const getLockedSeats = async (
  showtime_id: string
): Promise<LockedSeat[]> => {
  try {
    const res = await showtimeApi.get<{
      locked_seats?: LockedSeat[];
      result?: { locked_seats: LockedSeat[] };
    }>(`/${showtime_id}/locked-seats`);
    if (res.data.locked_seats) return res.data.locked_seats;
    if (res.data.result?.locked_seats) return res.data.result.locked_seats;
    return [];
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Lấy tất cả showtime (bao gồm cả quá khứ) - dành cho admin
export const getAllShowtimes = async (): Promise<Showtime[]> => {
  try {
    const res = await showtimeApi.get<{
      showtimes?: Showtime[];
      result?: { showtimes: Showtime[] };
    }>("");

    if (res.data.showtimes) return res.data.showtimes;
    if (res.data.result?.showtimes) return res.data.result.showtimes;
    return [];
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Lấy theo movie ID (bao gồm cả quá khứ) - dành cho admin
export const getAllShowtimeByMovieId = async (
  movie_id: string
): Promise<Showtime[]> => {
  try {
    const res = await showtimeApi.get<any>("", {
      params: { movie_id },
    });

    if (res.data.showtimes) return res.data.showtimes;
    if (res.data.result?.showtimes) return res.data.result.showtimes;
    return [];
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

// Lấy theo movie ID và theater ID (bao gồm cả quá khứ) - dành cho admin
export const getAllShowtimeByMovieIdAndTheaterId = async (
  movie_id: string,
  theater_id: string
): Promise<Showtime[]> => {
  try {
    const res = await showtimeApi.get<any>("", {
      params: { movie_id, theater_id },
    });

    if (res.data.showtimes) return res.data.showtimes;
    if (res.data.result?.showtimes) return res.data.result.showtimes;
    return [];
  } catch (error) {
    throw handleShowtimeError(error);
  }
};
