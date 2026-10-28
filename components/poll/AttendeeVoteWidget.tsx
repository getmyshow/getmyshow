"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Sparkle, CircleNotch, Lightning } from "@phosphor-icons/react";

interface PollOption {
  id: string;
  label: string;
  subtitle?: string;
  votes: number;
  color: string;
}

interface AttendeeVoteWidgetProps {
  pollId: string;
  title: string;
  question: string;
  options: PollOption[];
  onVoteSubmit?: (optionId: string) => void;
}

export default function AttendeeVoteWidget({
  pollId,
  title,
  question,
  options: initialOptions,
  onVoteSubmit,
}: AttendeeVoteWidgetProps) {
  const storageKey = `gms_poll_voted_${pollId}`;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [options, setOptions] = useState<PollOption[]>(initialOptions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingVote = localStorage.getItem(storageKey);
      if (existingVote) {
        setSelectedOption(existingVote);
        setHasVoted(true);
      }
    }
  }, [storageKey]);

  const totalVotes = options.reduce((acc, opt) => acc + opt.votes, 0);

  const handleCastVote = (optionId: string) => {
    if (hasVoted || isSubmitting) return;

    setSelectedOption(optionId);
    setIsSubmitting(true);

    setTimeout(() => {
      setOptions((prev) =>
        prev.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, optionId);
      }
      setHasVoted(true);
      setIsSubmitting(false);
      onVoteSubmit?.(optionId);
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-[#DBDAE3] p-6 sm:p-7 shadow-lg space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#4F46E5] mb-1">
          <Sparkle size={13} weight="fill" />
          <span>{title} • Live Audience Poll</span>
        </div>
        <h3 className="text-lg font-black text-[#1E0A3C] leading-snug">
          {question}
        </h3>
        <p className="text-xs text-[#6F7287] mt-1">
          {hasVoted
            ? "Your vote has been transmitted to the stage display in real-time."
            : "Tap your target option below to cast your instant live vote."}
        </p>
      </div>

      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const percentage =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

          if (hasVoted) {
            return (
              <div
                key={opt.id}
                className={`p-3.5 rounded-xl border relative overflow-hidden transition-all ${
                  isSelected
                    ? "border-[#4F46E5] bg-indigo-50/40 ring-1 ring-[#4F46E5]"
                    : "border-[#EEEDF2] bg-white"
                }`}
              >
                {/* Background Progress Bar */}
                <div
                  className={`absolute inset-y-0 left-0 opacity-15 transition-all duration-700 ${opt.color}`}
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {isSelected && (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-[#4F46E5] shrink-0"
                      />
                    )}
                    <div>
                      <span className="text-xs font-bold text-[#1E0A3C] block">
                        {opt.label}
                      </span>
                      {opt.subtitle && (
                        <span className="text-[10px] text-[#6F7287] block">
                          {opt.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#1E0A3C]">
                      {percentage}%
                    </span>
                    <span className="text-[10px] text-[#6F7287] block">
                      {opt.votes} votes
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleCastVote(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between active:scale-98 ${
                isSelected
                  ? "border-[#4F46E5] bg-indigo-50/50"
                  : "border-[#DBDAE3] bg-[#F8F7FA] hover:border-[#4F46E5]/60 hover:bg-white"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#1E0A3C] block">
                  {opt.label}
                </span>
                {opt.subtitle && (
                  <span className="text-[10px] text-[#6F7287] block mt-0.5">
                    {opt.subtitle}
                  </span>
                )}
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "border-[#4F46E5] bg-[#4F46E5]"
                    : "border-[#DBDAE3]"
                }`}
              >
                {isSelected && (
                  <CheckCircle size={18} weight="fill" className="text-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {hasVoted && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
          <CheckCircle size={16} weight="fill" className="text-emerald-600" />
          <span>Vote Submitted! Watch results update live on stage.</span>
        </div>
      )}
    </div>
  );
}

