import type { Showtime } from "../../../types/Showtime.type";
import type { GetTheatersResponse } from "../../../types/Theater.type";

type Props = {
  selectedInfo: any;
  setSelectedInfo: (val: any) => void;
  theater: GetTheatersResponse | null;
  showtimes: Showtime[];
  fetchShowtimesByTheater: (id: string) => void;
  isLoadingTheaters: boolean;
  isLoadingShowtimes: boolean;
};

export default function TheaterShowtime({
  selectedInfo,
  setSelectedInfo,
  theater,
  showtimes,
  fetchShowtimesByTheater,
  isLoadingTheaters,
  isLoadingShowtimes,
}: Props) {
  // Lọc ra các rạp có lịch chiếu (theater đã được filter từ API)
  const availableTheaters = theater?.result?.theaters || [];

  // Component loading spinner
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span className="ml-2 text-gray-400">Đang tải...</span>
    </div>
  );

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Rạp</h2>
      <div className="mb-4">
        {isLoadingTheaters ? (
          <LoadingSpinner />
        ) : availableTheaters.length ? (
          <select
            className="bg-[#2A2A2A] text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition"
            value={selectedInfo.theaterId || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              setSelectedInfo((prev: any) => ({
                ...prev,
                theaterId: selectedId,
                showtimeId: null,
                screenId: null,
              }));
              if (selectedId) {
                fetchShowtimesByTheater(selectedId);
              }
            }}
          >
            <option value="">-- Chọn rạp --</option>
            {availableTheaters.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} - {t.location}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-gray-400">Chưa có rạp nào có lịch chiếu cho phim này.</div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Suất chiếu</h2>
      <div className="mb-4">
        {isLoadingShowtimes ? (
          <LoadingSpinner />
        ) : showtimes.length ? (
          <div className="flex flex-wrap gap-2">
            {showtimes.map((showtime) => {
              const isSelected = selectedInfo.showtimeId === showtime._id;
              const date = new Date(showtime.start_time);
              const time = `${date.toLocaleDateString("vi-VN", {
                weekday: "short",
              })}, ${date.toLocaleDateString("vi-VN")} - ${date.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}`;
              return (
                <button
                  key={showtime._id}
                  onClick={() =>
                    setSelectedInfo((prev: any) => ({
                      ...prev,
                      showtimeId: showtime._id,
                      screenId: showtime.screen_id,
                    }))
                  }
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    isSelected
                      ? "bg-primary text-white"
                      : "border border-primary text-white hover:bg-[#1E1E1E]"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ) : selectedInfo.theaterId ? (
          <div className="text-gray-400">Chưa có suất chiếu nào cho rạp này.</div>
        ) : (
          <div className="text-gray-400">Vui lòng chọn rạp để xem suất chiếu.</div>
        )}
      </div>
    </>
  );
}
