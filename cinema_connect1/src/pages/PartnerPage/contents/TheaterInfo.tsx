import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const TheaterInfo = () => {
  const mockTheaters = [
    {
      id: 1,
      name: "Orange Cinema Central",
      location: "District 1, Ho Chi Minh City",
      capacity: 250,
      screens: 8,
      status: "Active",
      revenue: "$12,450",
      occupancy: 92,
      amenities: ["3D", "IMAX", "Dolby Atmos", "VIP Seats"],
      image: "/avenger_endgame.jpg",
    },
    {
      id: 2,
      name: "Sunset Theater Complex",
      location: "District 3, Ho Chi Minh City",
      capacity: 180,
      screens: 6,
      status: "Active",
      revenue: "$8,720",
      occupancy: 85,
      amenities: ["3D", "Premium Sound", "Recliner Seats"],
      image: "/spidermanAcross.jpg",
    },
    {
      id: 3,
      name: "Golden Screen Plaza",
      location: "District 7, Ho Chi Minh City",
      capacity: 320,
      screens: 12,
      status: "Maintenance",
      revenue: "$15,680",
      occupancy: 78,
      amenities: ["4DX", "IMAX", "VIP Lounge", "Concession Stand"],
      image: "/guardiansGalaxy.jpg",
    },
    {
      id: 4,
      name: "Diamond Cinema Hub",
      location: "District 2, Ho Chi Minh City",
      capacity: 200,
      screens: 7,
      status: "Active",
      revenue: "$9,830",
      occupancy: 88,
      amenities: ["3D", "Luxury Seating", "Bar & Grill"],
      image: "/johnWick4.png",
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
          <h2 className="text-2xl font-bold text-white">
            Theater Informations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTheaters.map((theater, index) => (
            <motion.div
              key={theater.id}
              className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {theater.name}
                  </h3>
                  <p className="text-slate-400 text-sm flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {theater.location}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theater.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {theater.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-700/30 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs">Capacity</p>
                  <p className="text-white font-bold">{theater.capacity}</p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs">Screens</p>
                  <p className="text-white font-bold">{theater.screens}</p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs">Revenue</p>
                  <p className="text-orange-400 font-bold">{theater.revenue}</p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs">Occupancy</p>
                  <p className="text-emerald-400 font-bold">
                    {theater.occupancy}%
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-400 text-xs mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {theater.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30"
                    >
                      {amenity}
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
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};

export default TheaterInfo;
