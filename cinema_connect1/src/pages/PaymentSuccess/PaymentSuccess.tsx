/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  Calendar,
  MapPin,
  Ticket,
  Star,
  ArrowRight,
  Share2,
  MessageSquare,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import bookingApi from "../../apis/booking.api";
import { formatCurrency, formatDateTime } from "../../utils/format";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("bookingId");
  console.log("Booking ID from URL:", bookingId);

  // Mock booking data - replace with actual API call
  const { data: bookingDatas, isLoading: isLoadingBooking } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingApi.getBookingById(bookingId || ""),
  });
  const bookingData = bookingDatas?.data?.result;

  const handleDownloadTicket = () => {
    // Implement ticket download logic
    console.log("Downloading ticket...");
  };

  const handleShareExperience = () => {
    // Implement social sharing logic
    console.log("Sharing experience...");
  };
  if (isLoadingBooking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading booking details...</p>
      </div>
    );
  }
  const handleWriteReview = () => {
    // Navigate to review page or open review modal
    navigate(`/movies/${bookingData?.movie?.title}?tab=reviews&write=true`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-500/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300"
          >
            Your tickets have been confirmed
          </motion.p>
        </motion.div>

        {/* Ticket Card */}
        {bookingData &&
          bookingData.movie &&
          bookingData.payment &&
          bookingData.showtime &&
          bookingData.theater && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8"
            >
              {/* Ticket Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/20">
                <div className="flex items-center gap-4">
                  <img
                    src={bookingData.movie.poster_url}
                    alt={bookingData.movie.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-lg"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {bookingData.movie.title}
                    </h2>
                    <p className="text-gray-300">
                      {bookingData.movie.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Ticket Code</p>
                  <p className="text-2xl font-bold text-green-400 font-mono">
                    {bookingData?.ticket_code}
                  </p>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                {/* Cinema & Time */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-purple-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Cinema</p>
                      <p className="text-white font-semibold">
                        {bookingData.theater.name}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {bookingData.theater.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-purple-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Showtime</p>
                      <p className="text-white font-semibold">
                        {formatDateTime(bookingData.showtime.start_time)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seats & Payment */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 text-purple-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Seats</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {bookingData.seats.map((seat, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium"
                          >
                            {seat.row}
                            {seat.number}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-purple-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Total Paid</p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(bookingData.total_amount)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        via {(bookingData.payment as any).method}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center py-6 border-t border-white/20">
                <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/30 rounded-lg mb-2 mx-auto"></div>
                    <p className="text-gray-400 text-xs">QR Code</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          <motion.button
            onClick={handleDownloadTicket}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 
                     text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <Download className="h-5 w-5" />
            Download Ticket
          </motion.button>

          <motion.button
            onClick={handleShareExperience}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 
                     text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all"
          >
            <Share2 className="h-5 w-5" />
            Share Experience
          </motion.button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            What's Next?
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">
                  Arrive 15 minutes early
                </p>
                <p className="text-gray-400 text-sm">
                  Present your ticket at the entrance
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Enjoyed the movie?</p>
                <p className="text-gray-400 text-sm">
                  Share your review with other movie lovers
                </p>
              </div>
              <button
                onClick={handleWriteReview}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg 
                         hover:bg-purple-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Write Review
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">View your bookings</p>
                <p className="text-gray-400 text-sm">
                  Manage all your cinema tickets in one place
                </p>
              </div>
              <button
                onClick={() => navigate("/my-bookings")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition-colors"
              >
                <Ticket className="h-4 w-4" />
                My Bookings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate("/movies")}
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            Book Another Movie →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
