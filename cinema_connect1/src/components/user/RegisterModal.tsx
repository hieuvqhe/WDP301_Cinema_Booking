import { FiX } from "react-icons/fi";

const RegisterModal = () => {
  return (
    <div className="">
      <div
        className="fixed inset-0 bg-black/50 background-blur-sm z-50 
            flex items-center justify-center p-4"
        // onClick={() => isFormOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-300">Join Us Now</h1>

            <button >
              <FiX className="w-5 h-5 text-gray-300 font-extrabold" />
            </button>
          </div>

          {/* Input Forms */}
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2
                      focus:ring-violet-500 focus:border-violet-500 bg-gray-700"
                // onChange={}
                // value={}
              />
            </div>

            <div>
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2
                      focus:ring-violet-500 focus:border-violet-500 bg-gray-700"
                // onChange={}
                // value={}
              />
            </div>

            <div className="flex justify-end text-xs pb-3">
              <p className="cursor-pointer hover:text-primary hover:underline transition">
                Forgot password?
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600
                  hover:from-red-600 hover:to-pink-600 transition-all duration-300 rounded-lg
                  shadow-md hover:shadow-lg hover:shadow-primary/15"
            //   disabled={isSubmitting}
            >
              {/* {isSubmitting ? "Signing in..." : "Sign in"} */}
              Sign in
            </button>

            <p className="text-center">
              Don't have account?{" "}
              <span className="cursor-pointer hover:text-primary transition">
                Register
              </span>{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
