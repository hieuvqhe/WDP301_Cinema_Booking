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
import QrScanner from "qr-scanner";

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
  const [cameraStatus, setCameraStatus] = useState<
    "idle" | "starting" | "active" | "error"
  >("idle");
  const [lastScannedCode, setLastScannedCode] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef(null);

  const setupVideoStream = async (mediaStream: MediaStream) => {
    if (!videoRef.current) {
      throw new Error("Video element not available");
    }

    console.log("Setting up video stream with element:", videoRef.current);

    const video = videoRef.current;
    video.srcObject = mediaStream;

    // Setup event listeners with proper cleanup
    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded");
      setCameraStatus("active");
    };

    const handleCanPlay = () => {
      console.log("Video can start playing");
      setIsScanning(true);
      startScanning();
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setCameraStatus("error");
      setError("Error playing video stream");
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Auto-play
    try {
      await video.play();
      console.log("Video started playing successfully");
    } catch (playError) {
      console.log(
        "Auto-play failed, user interaction may be required:",
        playError
      );
    }

    // Return cleanup function
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  };

  // 3. Simplified startCamera function
  const startCamera = async () => {
    try {
      setError(null);
      setCameraStatus("starting");
      console.log("Starting camera...");

      // Check if video element is available
      if (!videoRef.current) {
        throw new Error(
          "Video element not found. Component may not be fully mounted."
        );
      }

      // Camera constraints with fallback
      let constraints = {
        video: {
          facingMode: "environment", // Back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.log("Failed with environment camera, trying user camera:", err);
        // Fallback to front camera
        constraints = {
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      console.log("Camera stream obtained:", mediaStream);
      setStream(mediaStream);

      // Setup video stream
      await setupVideoStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraStatus("error");
      setError(
        "Could not access camera. Please check permissions and try again."
      );
      toast.error("Camera access failed");
    }
  };

  // 4. Add small delay in useEffect to ensure DOM is ready
  useEffect(() => {
    console.log("TicketVerification component mounted");

    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      console.log("Video ref after mount:", videoRef.current);
    }, 100);

    return () => {
      console.log("TicketVerification component unmounting");
      clearTimeout(timer);
      stopCamera();
    };
  }, []);

  // Stop camera
  const stopCamera = () => {
    console.log("Stopping camera...");

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped track:", track);
      });
      setStream(null);
    }

    if (videoRef.current) {
      const video = videoRef.current;

      // Remove all event listeners
      video.removeEventListener("loadedmetadata", () => {});
      video.removeEventListener("canplay", () => {});
      video.removeEventListener("error", () => {});

      // Clear video source
      video.srcObject = null;
      video.pause();
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setIsScanning(false);
    setCameraStatus("idle");
    console.log("Camera stopped");
  };

  // Real QR Code scanning logic using qr-scanner
  const startScanning = () => {
    if (!videoRef.current) {
      console.error("Video element not available for scanning");
      return;
    }

    console.log("Starting QR code scanning...");
    
    // Use qr-scanner to continuously scan for QR codes
    // Reduced frequency to improve performance
    scanIntervalRef.current = setInterval(async () => {
      await detectQRCode();
    }, 1000) as any;
  };

  // Real QR code detection using qr-scanner library
  const detectQRCode = async () => {
    if (!videoRef.current || isVerifying) {
      return;
    }

    try {
      const video = videoRef.current;
      
      // Check if video is ready
      if (video.readyState < 2) {
        return;
      }

      // Method 1: Try direct video scanning
      let result;
      try {
        result = await QrScanner.scanImage(video);
      } catch (directScanError) {
        // Method 2: Fallback - capture to canvas first
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            // Try scanning from canvas
            result = await QrScanner.scanImage(canvas);
          }
        } else {
          throw directScanError; // Re-throw if no canvas fallback
        }
      }

      if (result && result !== lastScannedCode) {
        console.log("QR Code detected:", result);
        setLastScannedCode(result);
        
        // Stop scanning temporarily to prevent multiple scans of the same code
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }
        
        // Show visual feedback
        toast.info(`QR Code detected: ${result.substring(0, 20)}...`);
        
        // Automatically verify the detected ticket code
        await handleVerifyTicket(result);
        
        // Resume scanning after 3 seconds
        setTimeout(() => {
          if (isScanning && !scanIntervalRef.current) {
            startScanning();
          }
        }, 3000);
      }
    } catch (error) {
      // This is expected when no QR code is found, so we don't log it as an error
      // qr-scanner throws when no QR code is found - this is normal behavior
      if (error instanceof Error) {
        // Only log if it's a real error, not just "no QR code found"
        if (!error.message.toLowerCase().includes("no qr code") && 
            !error.message.toLowerCase().includes("not found") &&
            !error.message.toLowerCase().includes("no code")) {
          console.warn("QR scan error:", error.message);
        }
      }
    }
  };

  // Play sound feedback
  const playSound = (isSuccess: boolean) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (isSuccess) {
        // Success sound: Higher pitch, longer duration
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        // Error sound: Lower pitch, shorter duration
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.log("Audio not supported or error playing sound:", error);
    }
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
      const isValid = result.result.status === "confirmed" && 
                     result.result.payment_status === "completed";
      
      if (isValid) {
        toast.success("✅ Valid Ticket - Allow Entry!");
        playSound(true);
      } else {
        toast.error("❌ Invalid Ticket - Deny Entry!");
        playSound(false);
      }

      // Auto-clear result after 10 seconds
      setTimeout(() => {
        setScanResult(null);
        setError(null);
        setLastScannedCode(""); // Allow rescanning the same code
      }, 10000);

    } catch (err: any) {
      const errorMessage = err.message || "Failed to verify ticket";
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
      playSound(false);
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setError(null);
        setLastScannedCode(""); // Allow rescanning the same code
      }, 5000);
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

  // Component mount and cleanup effect
  useEffect(() => {
    console.log("TicketVerification component mounted");
    console.log("Video ref on mount:", videoRef.current);

    // Check if QrScanner is supported
    if (!QrScanner.hasCamera()) {
      console.warn("No camera available for QR scanning");
      setError("No camera available on this device");
    }

    return () => {
      console.log("TicketVerification component unmounting");
      
      // Clean up scanning interval
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      
      // Stop camera
      stopCamera();
    };
  }, []);

  // Debug effect for videoRef changes
  useEffect(() => {
    console.log("Video ref changed:", videoRef.current);
  }, [videoRef.current]);

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
              <div
                className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative"
                data-testid="video-container"
              >
                {/* Always render video element but conditionally style it */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${
                    cameraStatus === "active" ? "block" : "hidden"
                  }`}
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {cameraStatus === "starting" && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <RefreshCw className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-spin" />
                      <p className="text-blue-400">Starting camera...</p>
                    </div>
                  </div>
                )}

                {cameraStatus === "active" && (
                  <>
                    {/* Scanning overlay - only show when actually scanning */}
                    {isScanning && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-4 border-2 border-blue-400 rounded-lg">
                          <motion.div
                            className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400"
                            animate={{ y: [0, 200, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                          {/* Corner brackets for better visual */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
                        </div>
                        <ScanLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-400" />
                        {/* Scanning text */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm">
                          Scanning for QR codes...
                        </div>
                      </div>
                    )}

                    {/* Camera status indicator */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      Live
                    </div>
                  </>
                )}

                {(cameraStatus === "idle" || cameraStatus === "error") && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">
                        {cameraStatus === "error"
                          ? "Camera error"
                          : "Camera not active"}
                      </p>
                      {cameraStatus === "error" && (
                        <p className="text-red-400 text-sm mt-2">
                          Check console for details
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-500">
                Status: {cameraStatus} | Stream: {stream ? "Active" : "None"} |
                Scanning: {isScanning ? "Yes" : "No"} | Last: {lastScannedCode ? lastScannedCode.substring(0, 10) + "..." : "None"}
              </div>
            </div>
            {/* Camera Controls */}
            <div className="flex gap-3">
              {cameraStatus === "idle" || cameraStatus === "error" ? (
                <button
                  onClick={startCamera}
                  disabled={cameraStatus === ("starting" as any)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
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

              {/* Retry button - show when stream exists but video element is null */}
              {stream && !videoRef.current && (
                <button
                  onClick={async () => {
                    console.log("Manual retry video setup...");
                    try {
                      await setupVideoStream(stream);
                    } catch (error) {
                      console.error("Retry failed:", error);
                      toast.error(
                        "Retry failed - try stopping and starting camera again"
                      );
                    }
                  }}
                  className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
                >
                  Retry Video
                </button>
              )}

              {/* Clear results button */}
              {(scanResult || error) && (
                <button
                  onClick={() => {
                    setScanResult(null);
                    setError(null);
                    setLastScannedCode("");
                    toast.info("Results cleared");
                  }}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  Clear
                </button>
              )}
              
              {/* Debug button */}
              <button
                onClick={() => {
                  console.log("=== CAMERA DEBUG INFO ===");
                  console.log("Camera Status:", cameraStatus);
                  console.log("Stream:", stream);
                  console.log("Video Element:", videoRef.current);
                  console.log("Is Scanning:", isScanning);
                  console.log("Last Scanned Code:", lastScannedCode);
                  console.log(
                    "Video Element in DOM:",
                    document.querySelector("video")
                  );
                  console.log(
                    "Component mounted:",
                    !!document.querySelector('[data-testid="video-container"]')
                  );

                  if (videoRef.current) {
                    console.log("Video srcObject:", videoRef.current.srcObject);
                    console.log(
                      "Video readyState:",
                      videoRef.current.readyState
                    );
                    console.log("Video paused:", videoRef.current.paused);
                    console.log(
                      "Video width/height:",
                      videoRef.current.videoWidth,
                      videoRef.current.videoHeight
                    );
                    console.log(
                      "Video currentTime:",
                      videoRef.current.currentTime
                    );
                  }

                  // Try to force video element refresh
                  if (stream && !videoRef.current) {
                    console.log("Attempting to retry video setup...");
                    setTimeout(() => {
                      if (videoRef.current && stream) {
                        console.log(
                          "Retrying video setup with existing stream"
                        );
                        setupVideoStream(stream);
                      }
                    }, 100);
                  }
                }}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                Debug
              </button>
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
