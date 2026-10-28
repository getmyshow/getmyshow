import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 bg-[#F8F7FA]">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#4F46E5] transition"
        >
          <CaretLeft size={16} weight="bold" />
          <span>Back to Home</span>
        </Link>
      </div>
      <Suspense fallback={<div className="w-80 h-96 rounded-2xl bg-slate-100 animate-pulse" />}>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
        />
      </Suspense>
    </div>
  );
}

