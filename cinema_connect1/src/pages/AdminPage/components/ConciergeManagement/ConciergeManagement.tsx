/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Shuffle,
  Eye,
  EyeOff,
  Check,
  X,
  Users,
  Plus,
} from "lucide-react";
import { addConcierge } from "../../../../apis/admin.api";
import type { addConciergeType } from "../../../../types";
import { toast } from "sonner";

// Password generation utility functions
const generateRandomString = (length: number, charset: string): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

const generateUsername = (): string => {
  const prefixes = ["staff", "qr", "concierge", "user"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumbers = generateRandomString(4, "0123456789");
  return `${randomPrefix}${randomNumbers}`;
};

const generateSecurePassword = (username?: string): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";

  // If username provided, start with username
  if (username) {
    password += username;
  }

  // Ensure we have at least one of each required character type
  password += generateRandomString(1, uppercase);
  password += generateRandomString(1, lowercase);
  password += generateRandomString(1, numbers);
  password += generateRandomString(1, specialChars);

  // Fill remaining length to reach at least 10 characters
  const remainingLength = Math.max(10 - password.length, 2);
  const allChars = lowercase + uppercase + numbers + specialChars;
  password += generateRandomString(remainingLength, allChars);

  // Shuffle the password to randomize character positions
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 10) {
    errors.push("Mật khẩu phải có ít nhất 10 ký tự");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Phải có ít nhất 1 ký tự thường");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Phải có ít nhất 1 ký tự in hoa");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Phải có ít nhất 1 số");
  }

  if (password.includes("#")) {
    errors.push("Không được chứa ký tự #");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

type CreationMode = "auto" | "semi-auto" | "manual";

export default function ConciergeManagement() {
  const [creationMode, setCreationMode] = useState<CreationMode>("auto");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
  }>({
    isValid: false,
    errors: [],
  });

  const addConciergeMutation = useMutation({
    mutationFn: async (data: addConciergeType) => addConcierge(data),
  });

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    setPasswordValidation(validatePassword(password));
  };

  const generateAutoCredentials = () => {
    const username = generateUsername();
    const email = `${username}@cinema.com`;
    const password = generateSecurePassword();

    setFormData({ email, password });
    setPasswordValidation(validatePassword(password));
  };

  const generateAutoPassword = () => {
    const emailUsername = formData.email.split("@")[0];
    const password = generateSecurePassword(emailUsername);
    handlePasswordChange(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      toast.error("Vui lòng kiểm tra lại mật khẩu");
      return;
    }

    try {
      await addConciergeMutation.mutateAsync(formData, {
        onSuccess: () => {
          toast.success("Thêm nhân viên thành công!");
          setFormData({ email: "", password: "" });
          setPasswordValidation({ isValid: false, errors: [] });
        },
        onError: (error: any) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      });
    } catch (error) {
      console.error("Error adding concierge:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý nhân viên quét QR
            </h1>
            <p className="text-gray-600">
              Tạo tài khoản cho nhân viên quét mã QR tại rạp
            </p>
          </div>
        </div>
      </motion.div>

      {/* Creation Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Chọn phương thức tạo tài khoản
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setCreationMode("auto")}
            className={`p-4 rounded-lg border-2 transition-all ${
              creationMode === "auto"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Shuffle className="h-6 w-6 mx-auto mb-2" />
            <h3 className="font-medium">Tự động hoàn toàn</h3>
            <p className="text-sm text-gray-600 mt-1">
              Tự động tạo email và mật khẩu
            </p>
          </button>

          <button
            onClick={() => setCreationMode("semi-auto")}
            className={`p-4 rounded-lg border-2 transition-all ${
              creationMode === "semi-auto"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <User className="h-6 w-6 mx-auto mb-2" />
            <h3 className="font-medium">Bán tự động</h3>
            <p className="text-sm text-gray-600 mt-1">
              Tự nhập email, tự động tạo mật khẩu
            </p>
          </button>

          <button
            onClick={() => setCreationMode("manual")}
            className={`p-4 rounded-lg border-2 transition-all ${
              creationMode === "manual"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Lock className="h-6 w-6 mx-auto mb-2" />
            <h3 className="font-medium">Thủ công</h3>
            <p className="text-sm text-gray-600 mt-1">
              Tự nhập cả email và mật khẩu
            </p>
          </button>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto Generation Button for Mode 1 */}
          {creationMode === "auto" && (
            <div className="text-center">
              <button
                type="button"
                onClick={generateAutoCredentials}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Shuffle className="h-5 w-5" />
                Tạo tài khoản tự động
              </button>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email nhân viên
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={creationMode === "auto"}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="staff@cinema.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              {(creationMode === "semi-auto" || creationMode === "manual") && (
                <button
                  type="button"
                  onClick={generateAutoPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Shuffle className="h-4 w-4" />
                  Tạo mật khẩu
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={creationMode === "auto"}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="Mật khẩu tối thiểu 10 ký tự"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Validation */}
            {formData.password && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {passwordValidation.isValid ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      passwordValidation.isValid
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordValidation.isValid
                      ? "Mật khẩu hợp lệ"
                      : "Mật khẩu chưa đủ yêu cầu"}
                  </span>
                </div>
                {passwordValidation.errors.length > 0 && (
                  <ul className="space-y-1">
                    {passwordValidation.errors.map((error, index) => (
                      <li
                        key={index}
                        className="text-xs text-red-600 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        {error}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                !passwordValidation.isValid || addConciergeMutation.isPending
              }
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {addConciergeMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {addConciergeMutation.isPending
                ? "Đang thêm..."
                : "Thêm nhân viên"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
