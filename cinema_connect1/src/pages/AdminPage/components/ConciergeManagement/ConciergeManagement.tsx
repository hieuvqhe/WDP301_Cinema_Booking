/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Search,
  Trash2,
  Edit,
  Calendar,
  Phone,
} from "lucide-react";
import { addConcierge, getAllConcierge } from "../../../../apis/admin.api";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [isBatchCreating, setIsBatchCreating] = useState(false);

  const queryClient = useQueryClient();

  // Fetch concierge list
  const { data: conciergeData, isLoading: isLoadingConcierges } = useQuery({
    queryKey: ["concierges", currentPage, searchTerm],
    queryFn: () =>
      getAllConcierge({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
      }),
  });

  const addConciergeMutation = useMutation({
    mutationFn: async (data: addConciergeType) => addConcierge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concierges"] });
    },
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

  const handleBatchCreate = async () => {
    if (batchCount < 1 || batchCount > 50) {
      toast.error("Số lượng phải từ 1 đến 50");
      return;
    }

    setIsBatchCreating(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < batchCount; i++) {
        try {
          const username = generateUsername();
          const email = `${username}@cinema.com`;
          const password = generateSecurePassword();

          await addConcierge({ email, password });
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to create account ${i + 1}:`, error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["concierges"] });

      if (successCount === batchCount) {
        toast.success(`Đã tạo thành công ${successCount} tài khoản!`);
      } else {
        toast.warning(
          `Tạo thành công ${successCount}/${batchCount} tài khoản. ${failCount} thất bại.`
        );
      }

      setBatchCount(1);
    } catch (error) {
      console.error("Error creating batch accounts:", error);
      toast.error("Có lỗi xảy ra khi tạo tài khoản hàng loạt");
    } finally {
      setIsBatchCreating(false);
    }
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
          setShowForm(false);
        },
        onError: (error: any) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      });
    } catch (error) {
      console.error("Error adding concierge:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Quản lý nhân viên quét QR
              </h1>
              <p className="text-gray-300">
                Tạo tài khoản cho nhân viên quét mã QR tại rạp
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              {showForm ? "Ẩn form" : "Thêm nhân viên"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 p-6 mb-6"
      >
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo email hoặc tên..."
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Tìm kiếm
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Danh sách nhân viên
          </h2>
          <span className="text-gray-400">
            {conciergeData?.result.total || 0} nhân viên
          </span>
        </div>

        {isLoadingConcierges ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Đang tải...</p>
          </div>
        ) : conciergeData?.result?.concierges.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Chưa có nhân viên nào</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {conciergeData?.result?.concierges.map((concierge, index) => (
                <motion.div
                  key={concierge._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {concierge.name || "Chưa cập nhật"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{concierge.email}</span>
                          </div>
                          {concierge.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{concierge.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Tạo: {formatDate(concierge.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {conciergeData && conciergeData.result.total_pages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: conciergeData.result.total_pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {showForm && (
        <>
          {/* Creation Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Chọn phương thức tạo tài khoản
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setCreationMode("auto")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  creationMode === "auto"
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-slate-600 hover:border-slate-500 text-gray-300"
                }`}
              >
                <Shuffle className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-medium">Tự động hoàn toàn</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Tự động tạo email và mật khẩu
                </p>
              </button>

              <button
                onClick={() => setCreationMode("semi-auto")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  creationMode === "semi-auto"
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-slate-600 hover:border-slate-500 text-gray-300"
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-medium">Bán tự động</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Tự nhập email, tự động tạo mật khẩu
                </p>
              </button>

              <button
                onClick={() => setCreationMode("manual")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  creationMode === "manual"
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-slate-600 hover:border-slate-500 text-gray-300"
                }`}
              >
                <Lock className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-medium">Thủ công</h3>
                <p className="text-sm text-gray-400 mt-1">
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
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Auto Generation for Mode 1 */}
              {creationMode === "auto" && (
                <div className="space-y-6">
                  {/* Single Account Generation */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={generateAutoCredentials}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Shuffle className="h-5 w-5" />
                      Tạo 1 tài khoản tự động
                    </button>
                  </div>

                  {/* Batch Creation Section */}
                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">
                      Tạo nhiều tài khoản cùng lúc
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-300">
                          Số lượng:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={batchCount}
                          onChange={(e) =>
                            setBatchCount(parseInt(e.target.value) || 1)
                          }
                          className="w-20 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleBatchCreate}
                        disabled={
                          isBatchCreating || batchCount < 1 || batchCount > 50
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isBatchCreating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <Users className="h-5 w-5" />
                            Tạo {batchCount} tài khoản
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Tối đa 50 tài khoản mỗi lần
                    </p>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email nhân viên
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={creationMode === "auto"}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-700/30 disabled:text-gray-400"
                    placeholder="staff@cinema.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Mật khẩu
                  </label>
                  {(creationMode === "semi-auto" ||
                    creationMode === "manual") && (
                    <button
                      type="button"
                      onClick={generateAutoPassword}
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
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
                    className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-700/30 disabled:text-gray-400"
                    placeholder="Mật khẩu tối thiểu 10 ký tự"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
                  <div className="mt-3 p-3 bg-slate-700/50 border border-slate-600 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {passwordValidation.isValid ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          passwordValidation.isValid
                            ? "text-green-400"
                            : "text-red-400"
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
                            className="text-xs text-red-400 flex items-center gap-1"
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
                    !passwordValidation.isValid ||
                    addConciergeMutation.isPending
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
        </>
      )}
    </div>
  );
}
