import { motion } from "framer-motion";
import { Building2, Calendar, Mail, Phone, User } from "lucide-react";

const Staffs = () => {
  const mockStaff = [
    {
      id: 1,
      name: "Nguyen Van Manager",
      email: "manager@cinema.com",
      role: "Theater Manager",
      department: "Operations",
      phone: "+84 123 456 789",
      joinDate: "2023-01-15",
      status: "Active",
      theater: "Orange Cinema Central",
      salary: "$2,500",
      avatar: "/avatar2.jpg",
    },
    {
      id: 2,
      name: "Tran Thi Cashier",
      email: "cashier@cinema.com",
      role: "Cashier",
      department: "Front Office",
      phone: "+84 987 654 321",
      joinDate: "2023-03-20",
      status: "Active",
      theater: "Sunset Theater Complex",
      salary: "$1,200",
      avatar: "/avatar2.jpg",
    },
    {
      id: 3,
      name: "Le Van Technician",
      email: "tech@cinema.com",
      role: "Technical Support",
      department: "Maintenance",
      phone: "+84 555 123 456",
      joinDate: "2022-11-10",
      status: "Active",
      theater: "Golden Screen Plaza",
      salary: "$1,800",
      avatar: "/avatar2.jpg",
    },
    {
      id: 4,
      name: "Pham Thi Security",
      email: "security@cinema.com",
      role: "Security Guard",
      department: "Security",
      phone: "+84 111 222 333",
      joinDate: "2023-06-01",
      status: "On Leave",
      theater: "Diamond Cinema Hub",
      salary: "$1,000",
      avatar: "/avatar2.jpg",
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
          <h2 className="text-2xl font-bold text-white">Staff Management</h2>
          <motion.button
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Staff
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockStaff.map((staff, index) => (
            <motion.div
              key={staff.id}
              className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mr-3">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {staff.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{staff.role}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    staff.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {staff.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-slate-300 text-sm">
                  <Mail size={16} className="mr-2 text-slate-400" />
                  {staff.email}
                </div>
                <div className="flex items-center text-slate-300 text-sm">
                  <Phone size={16} className="mr-2 text-slate-400" />
                  {staff.phone}
                </div>
                <div className="flex items-center text-slate-300 text-sm">
                  <Building2 size={16} className="mr-2 text-slate-400" />
                  {staff.theater}
                </div>
                <div className="flex items-center text-slate-300 text-sm">
                  <Calendar size={16} className="mr-2 text-slate-400" />
                  Joined {staff.joinDate}
                </div>
              </div>

              <div className="bg-slate-700/30 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Salary</span>
                  <span className="text-orange-400 font-bold">
                    {staff.salary}
                  </span>
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
                  Profile
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Staffs;
