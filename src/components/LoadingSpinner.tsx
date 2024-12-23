export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1120]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-[#1A2642]"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-[#0095FF] border-t-transparent"></div>
      </div>
    </div>
  );
}
