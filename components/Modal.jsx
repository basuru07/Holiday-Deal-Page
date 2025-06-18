export function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
        <button onClick={onClose} className="text-red-500 hover:text-red-700 mb-4">Close</button>
        {children}
      </div>
    </div>
  );
}