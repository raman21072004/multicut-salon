export const imageFallbackSrc =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none">
      <rect width="800" height="600" fill="#1f1f1f" />
      <rect x="24" y="24" width="752" height="552" rx="28" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="2" />
      <circle cx="400" cy="270" r="58" fill="#3a3a3a" />
      <path d="M280 430c31-56 67-84 120-84s89 28 120 84" stroke="#555" stroke-width="16" stroke-linecap="round" />
      <text x="400" y="512" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#c8a45a">Image unavailable</text>
    </svg>
  `);

export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  event.currentTarget.src = imageFallbackSrc;
}
