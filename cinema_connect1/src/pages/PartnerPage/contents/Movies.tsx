import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Movies = () => {
  const mockMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action, Adventure",
      duration: "181 min",
      rating: 4.9,
      status: "Now Showing",
      revenue: "$8,450",
      showtimes: ["14:00", "17:30", "21:00"],
      poster: "/avenger_endgame.jpg",
      director: "Anthony Russo, Joe Russo",
      cast: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
      bookings: 234,
    },
    {
      id: 2,
      title: "Spider-Man: Across the Spider-Verse",
      genre: "Animation, Action",
      duration: "140 min",
      rating: 4.8,
      status: "Now Showing",
      revenue: "$6,720",
      showtimes: ["13:30", "16:00", "19:30", "22:00"],
      poster: "/spidermanAcross.jpg",
      director: "Joaquim Dos Santos",
      cast: "Shameik Moore, Hailee Steinfeld, Oscar Isaac",
      bookings: 189,
    },
    {
      id: 3,
      title: "John Wick: Chapter 4",
      genre: "Action, Thriller",
      duration: "169 min",
      rating: 4.7,
      status: "Now Showing",
      revenue: "$7,380",
      showtimes: ["15:00", "18:30", "21:45"],
      poster: "/johnWick4.png",
      director: "Chad Stahelski",
      cast: "Keanu Reeves, Donnie Yen, Bill Skarsgård",
      bookings: 156,
    },
    {
      id: 4,
      title: "Guardians of the Galaxy Vol. 3",
      genre: "Action, Comedy",
      duration: "150 min",
      rating: 4.6,
      status: "Coming Soon",
      revenue: "$0",
      showtimes: ["TBA"],
      poster: "/guardiansGalaxy.jpg",
      director: "James Gunn",
      cast: "Chris Pratt, Zoe Saldana, Dave Bautista",
      bookings: 0,
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
          <h2 className="text-2xl font-bold text-white">Movie Management</h2>
          <motion.button
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Movie
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="aspect-[2/3] bg-slate-700/30 relative overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                    movie.status === "Now Showing"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {movie.status}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-slate-400 text-sm mb-3">
                  {movie.genre} • {movie.duration}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs">Rating</p>
                    <div className="flex items-center">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-current mr-1"
                      />
                      <span className="text-white font-bold">
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs">Revenue</p>
                    <p className="text-orange-400 font-bold">{movie.revenue}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-slate-400 text-xs mb-2">Showtimes Today</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.showtimes.map((time, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded border border-orange-500/30"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Movies;
