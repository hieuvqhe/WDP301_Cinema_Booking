/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ScanLine,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  User,
  Clock,
  Ticket,
} from "lucide-react";
import { verifyTicketCode } from "../../../../apis/admin.api";
import { toast } from "sonner";

interface VerificationResult {
  booking_id: string;
  ticket_code: string;
  status: string;
  payment_status: string;
  booking_time: string;
  verified_at: string;
}

const TicketVerification: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsScanning(true);
      startScanning();
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      toast.error("Camera access denied");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  // QR Code scanning logic (simplified - in production you'd use a proper QR scanner library)
  const startScanning = () => {
    (scanIntervalRef as any).current = setInterval(() => {
      if (videoRef.current && canvasRef.current && !isVerifying) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);

          // In a real implementation, you would use a QR code detection library here
          // For demo purposes, we'll simulate detection
          detectQRCode();
        }
      }
    }, 500);
  };

  // Simulate QR code detection (in production, use actual QR detection library)
  const detectQRCode = () => {
    // This is a placeholder - in production you'd use libraries like:
    // - qr-scanner
    // - jsqr
    // - qrcode-reader
    // For now, we'll just show the manual input option
  };

  // Verify ticket code
  const handleVerifyTicket = async (ticketCode: string) => {
    if (!ticketCode.trim()) {
      toast.error("Please enter a ticket code");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setScanResult(null);

    try {
      const result = await verifyTicketCode(ticketCode.trim());
      setScanResult(result.result);

      // Check if ticket is valid (confirmed status and completed payment)
      if (
        result.result.status === "confirmed" &&
        result.result.payment_status === "completed"
      ) {
        toast.success("Ticket verified successfully!");
      } else {
        toast.error("Invalid ticket - status or payment not confirmed");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to verify ticket";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // Get verification status
  const getVerificationStatus = () => {
    if (!scanResult) return null;

    const isValid =
      scanResult.status === "confirmed" &&
      scanResult.payment_status === "completed";
    return {
      isValid,
      icon: isValid ? CheckCircle : XCircle,
      color: isValid ? "text-green-500" : "text-red-500",
      bgColor: isValid ? "bg-green-50" : "bg-red-50",
      borderColor: isValid ? "border-green-200" : "border-red-200",
      message: isValid ? "Valid Ticket" : "Invalid Ticket",
    };
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const status = getVerificationStatus();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Ticket Verification
          </h1>
          <p className="text-gray-400">
            Scan or enter ticket codes to verify customer entries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Scanner Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <Camera className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">QR Scanner</h2>
            </div>

            {/* Camera View */}
            <div className="relative mb-6">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
                {isScanning ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-4 border-2 border-blue-400 rounded-lg">
                        <motion.div
                          className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400"
                          animate={{ y: [0, 200, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      </div>
                      <ScanLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-400" />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Camera not active</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Controls */}
            <div className="flex gap-3">
              {!isScanning ? (
                <button
                  onClick={startCamera}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  Start Scanner
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  Stop Scanner
                </button>
              )}
            </div>

            {/* Manual Input */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="text-lg font-medium text-white mb-4">
                Manual Input
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter ticket code manually"
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleVerifyTicket(manualInput);
                    }
                  }}
                />
                <button
                  onClick={() => handleVerifyTicket(manualInput)}
                  disabled={isVerifying}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {isVerifying ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  Verify
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <Ticket className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">
                Verification Result
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <div>
                      <h3 className="font-medium text-red-800">
                        Verification Failed
                      </h3>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {scanResult && status && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${status.bgColor} ${status.borderColor} border rounded-lg p-6`}
                >
                  {/* Status Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <status.icon className={`h-8 w-8 ${status.color}`} />
                    <div>
                      <h3 className={`text-lg font-semibold ${status.color}`}>
                        {status.message}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Verified at {formatDate(scanResult.verified_at)}
                      </p>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Ticket className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Ticket Code</p>
                        <p className="font-mono font-medium">
                          {scanResult.ticket_code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Booking ID</p>
                        <p className="font-mono font-medium">
                          {scanResult.booking_id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Booking Time</p>
                        <p className="font-medium">
                          {formatDate(scanResult.booking_time)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p
                          className={`font-medium capitalize ${
                            scanResult.status === "confirmed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {scanResult.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment</p>
                        <p
                          className={`font-medium capitalize ${
                            scanResult.payment_status === "completed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {scanResult.payment_status}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!scanResult && !error && (
                <div className="text-center py-12">
                  <ScanLine className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Scan a QR code or enter a ticket code to verify
                  </p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">
                Verification Instructions
              </h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>
                  • Only tickets with "confirmed" status and "completed" payment
                  are valid
                </li>
                <li>
                  • Use the camera scanner for QR codes or enter ticket codes
                  manually
                </li>
                <li>• Green result = Valid ticket, allow entry</li>
                <li>• Red result = Invalid ticket, deny entry</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketVerification;
