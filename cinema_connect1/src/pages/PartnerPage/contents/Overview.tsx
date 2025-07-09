import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Calendar,
  BarChart3,
  Film,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
} from "lucide-react";
const Overview = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: "$45,230",
      change: "+12%",
      icon: DollarSign,
      changeType: "positive",
    },
    {
      label: "Active Theaters",
      value: "8",
      change: "+2",
      icon: Building2,
      changeType: "positive",
    },
    {
      label: "Movies Showing",
      value: "24",
      change: "+5",
      icon: Film,
      changeType: "positive",
    },
    {
      label: "Today's Bookings",
      value: "156",
      change: "+18%",
      icon: Calendar,
      changeType: "positive",
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-2 tracking-tight">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp size={14} className="mr-1 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/30">
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <motion.div
            className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Recent Bookings
              </h3>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg shadow-lg shadow-orange-500/30">
                <Calendar size={20} className="text-white" />
              </div>
            </div>
            <div className="space-y-3">
              {[
                {
                  movie: "Avengers: Endgame",
                  theater: "Theater 1",
                  time: "7:30 PM",
                  price: "$24.00",
                  rating: 4.9,
                },
                {
                  movie: "Spider-Man: No Way Home",
                  theater: "Theater 2",
                  time: "9:00 PM",
                  price: "$26.00",
                  rating: 4.8,
                },
                {
                  movie: "The Batman",
                  theater: "Theater 3",
                  time: "6:15 PM",
                  price: "$22.00",
                  rating: 4.7,
                },
                {
                  movie: "Top Gun: Maverick",
                  theater: "Theater 1",
                  time: "8:45 PM",
                  price: "$25.00",
                  rating: 4.9,
                },
                {
                  movie: "Doctor Strange 2",
                  theater: "Theater 2",
                  time: "10:30 PM",
                  price: "$24.00",
                  rating: 4.6,
                },
              ].map((booking, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-all duration-300 border border-slate-600/30 hover:border-orange-500/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium">{booking.movie}</p>
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-current"
                        />
                        <span className="text-yellow-400 text-xs font-medium">
                          {booking.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {booking.theater} - {booking.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-400 font-semibold text-lg">
                      {booking.price}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Theater Performance */}
          <motion.div
            className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Theater Performance
              </h3>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg shadow-lg shadow-orange-500/30">
                <BarChart3 size={20} className="text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "Theater 1",
                  occupancy: 95,
                  capacity: 120,
                  revenue: "$2,850",
                },
                {
                  name: "Theater 2",
                  occupancy: 87,
                  capacity: 100,
                  revenue: "$2,175",
                },
                {
                  name: "Theater 3",
                  occupancy: 78,
                  capacity: 150,
                  revenue: "$2,925",
                },
                {
                  name: "Theater 4",
                  occupancy: 92,
                  capacity: 80,
                  revenue: "$1,840",
                },
              ].map((theater, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-slate-700/40 rounded-lg border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{theater.name}</p>
                      <p className="text-slate-400 text-sm">
                        {theater.occupancy}% occupancy • {theater.capacity}{" "}
                        seats
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-orange-400 font-semibold">
                        {theater.revenue}
                      </span>
                      <p className="text-slate-400 text-xs">Today's revenue</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${theater.occupancy}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Add Movie",
                icon: Film,
                color: "from-orange-500 to-red-500",
              },
              {
                label: "Schedule Show",
                icon: Clock,
                color: "from-amber-500 to-yellow-500",
              },
              {
                label: "View Reports",
                icon: BarChart3,
                color: "from-emerald-500 to-green-500",
              },
              {
                label: "Manage Staff",
                icon: Users,
                color: "from-blue-500 to-cyan-500",
              },
            ].map((action, index) => (
              <motion.button
                key={index}
                className="p-4 bg-slate-700/40 rounded-lg border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300 group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`bg-gradient-to-r ${action.color} p-3 rounded-lg mb-3 mx-auto w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <action.icon size={24} className="text-white" />
                </div>
                <p className="text-white font-medium text-sm">{action.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Overview;
