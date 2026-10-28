import Link from "next/link";
import EmptyEventsIllustration from "@/components/illustrations/EmptyEventsIllustration";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#F8F7FA] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#DBDAE3] p-8 sm:p-10 text-center space-y-6 shadow-sm">
        <div className="flex justify-center">
          <EmptyEventsIllustration className="w-48 h-36" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#F05537] uppercase tracking-wider">
            404 • Page Not Found
          </span>
          <h1 className="text-2xl font-black text-[#1E0A3C]">
            Event or Page Unavailable
          </h1>
          <p className="text-sm text-[#6F7287] leading-relaxed">
            The event pass or link you are looking for has either concluded, expired, or been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 px-6 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white text-sm font-bold transition-all shadow-xs active:scale-95"
          >
            Explore Live Events
          </Link>
        </div>
      </div>
    </div>
  );
}
