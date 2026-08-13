export default function Footer({ buttonText, onSave, loading }) {
  return (
    <div className="flex justify-end mt-6">
      <button
        onClick={onSave}
        disabled={loading}
        className={`inside mt-2 p-2 ml-auto ${buttonText ? "w-[180px]" : "w-[120px]"} bg-accent text-white hover:opacity-90 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {buttonText || "Update"}
      </button>
    </div>
  );
}
