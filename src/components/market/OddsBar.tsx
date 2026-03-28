"use client";

interface OddsBarProps {
  yesOddsBps: bigint;
  noOddsBps: bigint;
}

export default function OddsBar({ yesOddsBps, noOddsBps }: OddsBarProps) {
  const yesPercent = Number(yesOddsBps) / 100;
  const noPercent = Number(noOddsBps) / 100;

  // Handle edge case where both are 0
  const displayYes = yesPercent === 0 && noPercent === 0 ? 50 : yesPercent;
  const displayNo = yesPercent === 0 && noPercent === 0 ? 50 : noPercent;

  return (
    <div className="w-full">
      <div className="flex w-full h-8 rounded-lg overflow-hidden">
        <div
          className="flex items-center justify-center transition-all duration-700 ease-in-out bg-[var(--accent-green)]"
          style={{ width: `${Math.max(displayYes, 2)}%` }}
        >
          {displayYes >= 15 && (
            <span className="text-xs font-bold text-white px-1">
              YES {displayYes.toFixed(0)}%
            </span>
          )}
        </div>
        <div
          className="flex items-center justify-center transition-all duration-700 ease-in-out bg-[var(--accent-red)]"
          style={{ width: `${Math.max(displayNo, 2)}%` }}
        >
          {displayNo >= 15 && (
            <span className="text-xs font-bold text-white px-1">
              NO {displayNo.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
      {/* Show labels outside bar when too small */}
      <div className="flex justify-between mt-1 px-1">
        {displayYes < 15 && (
          <span className="text-xs font-semibold text-d7-green">
            YES {displayYes.toFixed(0)}%
          </span>
        )}
        {displayYes >= 15 && <span />}
        {displayNo < 15 && (
          <span className="text-xs font-semibold text-d7-red">
            NO {displayNo.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
