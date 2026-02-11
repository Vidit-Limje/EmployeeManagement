function Notification({ message, type, onClose }) {
  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4`}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="font-bold text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Notification;
