import { motion } from "framer-motion";

const Bookings = () => {
  const mockBookings = [
    {
      id: "BK001",
      customer: "Nguyen Van A",
      email: "nguyenvana@email.com",
      movie: "Avengers: Endgame",
      theater: "Orange Cinema Central",
      showtime: "2024-12-26 21:00",
      seats: ["A1", "A2"],
      total: "$32.00",
      status: "Confirmed",
      bookingDate: "2024-12-24",
      paymentMethod: "Credit Card",
    },
    {
      id: "BK002",
      customer: "Tran Thi B",
      email: "tranthib@email.com",
      movie: "Spider-Man: Across the Spider-Verse",
      theater: "Sunset Theater Complex",
      showtime: "2024-12-26 16:00",
      seats: ["B5", "B6", "B7"],
      total: "$36.00",
      status: "Confirmed",
      bookingDate: "2024-12-25",
      paymentMethod: "PayPal",
    },
    {
      id: "BK003",
      customer: "Le Van C",
      email: "levanc@email.com",
      movie: "John Wick: Chapter 4",
      theater: "Golden Screen Plaza",
      showtime: "2024-12-26 18:30",
      seats: ["C10"],
      total: "$14.00",
      status: "Pending",
      bookingDate: "2024-12-26",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "BK004",
      customer: "Pham Thi D",
      email: "phamthid@email.com",
      movie: "Avengers: Endgame",
      theater: "Diamond Cinema Hub",
      showtime: "2024-12-26 21:00",
      seats: ["D8", "D9"],
      total: "$32.00",
      status: "Cancelled",
      bookingDate: "2024-12-23",
      paymentMethod: "Credit Card",
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
          <h2 className="text-2xl font-bold text-white">Booking Management</h2>
          <div className="flex gap-3">
            <motion.button
              className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Booking
            </motion.button>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Movie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Theater
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Showtime
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Seats
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Total
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
                {mockBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-orange-400">
                        {booking.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {booking.customer}
                      </div>
                      <div className="text-sm text-slate-400">
                        {booking.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{booking.movie}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{booking.theater}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{booking.showtime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {booking.seats.map((seat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded border border-orange-500/30"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-emerald-400 font-medium">
                        {booking.total}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "Confirmed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : booking.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View
                        </motion.button>
                        <motion.button
                          className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
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

export default Bookings;
