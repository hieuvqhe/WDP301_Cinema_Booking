import { motion} from "framer-motion";
import { FiX } from "react-icons/fi";

interface LoginModalProps {
  closeModal: () => void;
}

const LoginModal = ({ closeModal }: LoginModalProps) => {
  return (
      <motion.div
        className="fixed inset-0 bg-black/50 background-blur-sm z-50 
        flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={closeModal}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
            duration: 0.8,
          }}
          className="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-300">Sign In</h1>

            <button onClick={closeModal} className="cursor-pointer">
              <FiX className="w-5 h-5 text-gray-300 font-extrabold" />
            </button>
          </div>

          {/* Input Forms */}
          <form className="space-y-4" onSubmit={() => console.log("hello")}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2
                  focus:ring-violet-500 focus:border-violet-500 bg-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2
                  focus:ring-violet-500 focus:border-violet-500 bg-gray-700"
              />
            </div>

            <p className="text-right text-gray-300 hover:underline transition-all duration-200 cursor-pointer">Forgot password?</p>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-400
              hover:from-violet-700 hover:to-purple-700 transition-all duration-300 rounded-lg
              shadow-md hover:shadow-lg hover:shadow-violet-600/50 cursor-pointer"
            >
              Send Message
            </motion.button>

            <p className="text-center text-gray-300">Don't have account? <span className="text-purple-400 hover:text-purple-600 cursor-pointer">Sign up</span></p>
          </form>
        </motion.div>
      </motion.div>
  );
};

export default LoginModal;
