import { motion } from "framer-motion";

const Showtimes = () => {
  const mockShowtimes = [
    {
      id: 1,
      movie: "Avengers: Endgame",
      theater: "Orange Cinema Central - Screen 1",
      date: "2024-12-26",
      time: "14:00",
      price: "$15.00",
      availableSeats: 45,
      totalSeats: 120,
      status: "On Sale",
      bookings: 75,
    },
    {
      id: 2,
      movie: "Spider-Man: Across the Spider-Verse",
      theater: "Sunset Theater Complex - Screen 2",
      date: "2024-12-26",
      time: "16:00",
      price: "$12.00",
      availableSeats: 28,
      totalSeats: 100,
      status: "On Sale",
      bookings: 72,
    },
    {
      id: 3,
      movie: "John Wick: Chapter 4",
      theater: "Golden Screen Plaza - Screen 3",
      date: "2024-12-26",
      time: "18:30",
      price: "$14.00",
      availableSeats: 15,
      totalSeats: 150,
      status: "Almost Full",
      bookings: 135,
    },
    {
      id: 4,
      movie: "Avengers: Endgame",
      theater: "Diamond Cinema Hub - Screen 1",
      date: "2024-12-26",
      time: "21:00",
      price: "$16.00",
      availableSeats: 8,
      totalSeats: 80,
      status: "Almost Full",
      bookings: 72,
    },
    {
      id: 5,
      movie: "Spider-Man: Across the Spider-Verse",
      theater: "Orange Cinema Central - Screen 2",
      date: "2024-12-27",
      time: "13:30",
      price: "$12.00",
      availableSeats: 55,
      totalSeats: 120,
      status: "On Sale",
      bookings: 65,
    },
  ];
  return (
    <div>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Showtime Management</h2>
          <motion.button
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Showtime
          </motion.button>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Movie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Theater
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Seats
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockShowtimes.map((showtime, index) => (
                  <motion.tr
                    key={showtime.id}
                    className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {showtime.movie}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{showtime.theater}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{showtime.date}</div>
                      <div className="text-sm text-slate-400">
                        {showtime.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-orange-400 font-medium">
                        {showtime.price}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">
                        {showtime.availableSeats}/{showtime.totalSeats}
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              ((showtime.totalSeats - showtime.availableSeats) /
                                showtime.totalSeats) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          showtime.status === "On Sale"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {showtime.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Showtimes;
