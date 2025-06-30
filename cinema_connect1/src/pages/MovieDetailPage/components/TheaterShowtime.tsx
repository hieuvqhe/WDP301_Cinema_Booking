import type { Showtime } from "../../../types/Showtime.type";
import type { GetTheatersResponse } from "../../../types/Theater.type";

type Props = {
  selectedInfo: any;
  setSelectedInfo: (val: any) => void;
  theater: GetTheatersResponse | null;
  showtimes: Showtime[];
  fetchShowtimesByTheater: (id: string) => void;
};

export default function TheaterShowtime({
  selectedInfo,
  setSelectedInfo,
  theater,
  showtimes,
  fetchShowtimesByTheater,
}: Props) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Rạp</h2>
      <div className="mb-4">
        {theater?.result?.theaters?.length ? (
          <select
            className="bg-[#2A2A2A] text-gray-300 px-4 py-2 rounded-lg border border-gray-700"
            value={selectedInfo.theaterId || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              setSelectedInfo((prev: any) => ({
                ...prev,
                theaterId: selectedId,
                showtimeId: null,
                screenId: null,
              }));
              fetchShowtimesByTheater(selectedId);
            }}
          >
            <option value="">-- Chọn rạp --</option>
            {theater.result.theaters.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-gray-400">Chưa có rạp nào.</div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Suất chiếu</h2>
      <div className="mb-4">
        {showtimes.length ? (
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
        ) : (
          <div className="text-gray-400">Chưa có suất chiếu nào.</div>
        )}
      </div>
    </>
  );
}
