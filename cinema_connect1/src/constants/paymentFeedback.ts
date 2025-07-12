export const PAYMENT_METHODS = {
  VNPAY: "vnpay",
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  CASH: "cash",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_METHOD_ICONS = {
  [PAYMENT_METHODS.VNPAY]: "💳",
  [PAYMENT_METHODS.CREDIT_CARD]: "💳",
  [PAYMENT_METHODS.DEBIT_CARD]: "💳",
  [PAYMENT_METHODS.CASH]: "💵",
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.VNPAY]: "VNPay",
  [PAYMENT_METHODS.CREDIT_CARD]: "Credit Card",
  [PAYMENT_METHODS.DEBIT_CARD]: "Debit Card",
  [PAYMENT_METHODS.CASH]: "Cash",
} as const;

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUSES.PENDING]: {
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  [PAYMENT_STATUSES.COMPLETED]: {
    text: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  [PAYMENT_STATUSES.FAILED]: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  [PAYMENT_STATUSES.REFUNDED]: {
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
} as const;

// Feedback related constants
export const FEEDBACK_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const FEEDBACK_STATUS_COLORS = {
  [FEEDBACK_STATUSES.PENDING]: {
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  [FEEDBACK_STATUSES.APPROVED]: {
    text: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  [FEEDBACK_STATUSES.REJECTED]: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
} as const;

export const FEEDBACK_LIMITS = {
  TITLE_MIN: 5,
  TITLE_MAX: 100,
  CONTENT_MIN: 10,
  CONTENT_MAX: 2000,
} as const;

export const FEEDBACK_SORT_OPTIONS = [
  { value: "created_at", label: "Newest First", order: "desc" },
  { value: "created_at", label: "Oldest First", order: "asc" },
  { value: "title", label: "Title A-Z", order: "asc" },
  { value: "title", label: "Title Z-A", order: "desc" },
] as const;

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
  PAYMENTS_PER_PAGE: 10,
  FEEDBACKS_PER_PAGE: 10,
} as const;

// Timeout constants (in milliseconds)
export const TIMEOUTS = {
  PAYMENT_SESSION: 15 * 60 * 1000, // 15 minutes
  FEEDBACK_DEBOUNCE: 500, // 500ms for search debounce
  AUTO_REFRESH: 30 * 1000, // 30 seconds for auto-refresh
  TOAST_DURATION: 5000, // 5 seconds for toast messages
} as const;

// API endpoints
export const API_ENDPOINTS = {
  PAYMENTS: "/cinema/payments",
  FEEDBACK: "/feedback",
  VNPAY_CALLBACK: "/cinema/payments/vnpay-callback",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  PAYMENT_FORM_DATA: "cinema_payment_form",
  FEEDBACK_DRAFT: "cinema_feedback_draft",
  PAYMENT_FILTERS: "cinema_payment_filters",
  FEEDBACK_FILTERS: "cinema_feedback_filters",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PAYMENT_CREATED: "Payment initiated successfully",
  PAYMENT_COMPLETED: "Payment completed successfully!",
  FEEDBACK_CREATED: "Your review has been submitted for moderation",
  FEEDBACK_UPDATED: "Review updated successfully",
  FEEDBACK_DELETED: "Review deleted successfully",
  FEEDBACK_APPROVED: "Feedback approved successfully",
  FEEDBACK_REJECTED: "Feedback rejected successfully",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  PAYMENT_FAILED: "Payment failed. Please try again.",
  PAYMENT_CANCELLED: "Payment was cancelled.",
  FEEDBACK_REQUIRED_FIELDS: "Please fill in all required fields",
  FEEDBACK_TITLE_LENGTH: "Title must be between 5 and 100 characters",
  FEEDBACK_CONTENT_LENGTH: "Content must be between 10 and 2000 characters",
  UNAUTHORIZED: "Please log in to continue",
  NETWORK_ERROR: "Network error. Please check your connection.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
} as const;

// Validation rules
export const VALIDATION_RULES = {
  FEEDBACK: {
    TITLE: {
      MIN_LENGTH: FEEDBACK_LIMITS.TITLE_MIN,
      MAX_LENGTH: FEEDBACK_LIMITS.TITLE_MAX,
      REQUIRED: true,
    },
    CONTENT: {
      MIN_LENGTH: FEEDBACK_LIMITS.CONTENT_MIN,
      MAX_LENGTH: FEEDBACK_LIMITS.CONTENT_MAX,
      REQUIRED: true,
    },
  },
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_PAYMENT_RETRY: true,
  ENABLE_FEEDBACK_EDITING: true,
  ENABLE_SPOILER_WARNINGS: true,
  ENABLE_FEEDBACK_RATINGS: true,
  ENABLE_PAYMENT_ANALYTICS: true,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MODAL_ANIMATION_DURATION: 200,
  CARD_HOVER_SCALE: 1.02,
  BUTTON_TAP_SCALE: 0.98,
  SKELETON_PULSE_DURATION: 1500,
} as const;
