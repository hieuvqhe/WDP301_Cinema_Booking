import { FaStar } from "react-icons/fa";

export default function FeedbackSection({
  userId,
  selectedInfo,
  setSelectedInfo,
  feedbacks,
  handleSubmitFeedback,
}: any) {
  return (
    <div className="mt-10 bg-[#1E1E1E] text-gray-300 rounded-3xl p-6 mb-2">
      <h2 className="text-2xl font-bold mb-4">Rating movie</h2>
      {userId && (
        <div className="mb-6">
          <p className="mb-2 font-semibold">Select rating star:</p>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                onClick={() =>
                  setSelectedInfo((prev: any) => ({ ...prev, rating: i + 1 }))
                }
                className={`cursor-pointer text-2xl ${
                  i < selectedInfo.rating
                    ? "text-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <textarea
            className="w-full p-3 border border-gray-700 bg-[#2A2A2A] text-white rounded-lg"
            rows={4}
            placeholder="Write down your comment..."
            value={selectedInfo.comment}
            onChange={(e) =>
              setSelectedInfo((prev: any) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
          />
          <button
            onClick={handleSubmitFeedback}
            className="mt-2 px-4 py-2 text-xs bg-primary rounded-full text-white"
          >
            Send
          </button>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6">Feedback from viewers:</h3>
      {feedbacks.length ? (
        feedbacks.map((fb: any, idx: number) => (
          <div key={idx} className="border-b border-gray-700 py-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < fb.rating ? "text-yellow-400" : "text-gray-500"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-400">
                {fb.user?.email || "Ẩn danh"}
              </span>
            </div>
            <p className="text-sm text-gray-300">{fb.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 mt-2">No reviews yet.</p>
      )}
    </div>
  );
}
