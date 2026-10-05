import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, max = 5, size = 16, showScore = true, onRate = null }) {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    const isFilled = i <= Math.floor(rating);
    const isHalf = !isFilled && i <= Math.ceil(rating) && rating % 1 >= 0.3;

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!onRate}
        onClick={() => onRate && onRate(i)}
        className={`${onRate ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none p-0.5`}
      >
        <Star
          size={size}
          className={`${
            isFilled
              ? 'text-amber-400 fill-amber-400'
              : isHalf
              ? 'text-amber-400 fill-amber-200'
              : 'text-slate-300'
          }`}
        />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center">{stars}</div>
      {showScore && (
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}
