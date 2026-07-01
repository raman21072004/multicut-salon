import { Service } from "./types";

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

export const CATEGORY_ICONS: Record<string, string> = {
  "Hair Cuts": "✂️",
  "Beard & Shave": "🪒",
  "Hair Wash & Head Massage": "🚿",
  "Hair Spa": "💆",
  "Hair Colour": "🎨",
  "Hair Color": "🎨",
  "Beard Colour": "🖌️",
  "Beard Color": "🖌️",
  "Hair Treatment": "⚗️",
  "Hair Curling & Perm": "🌀",
  "Styling": "💈",
  "Facial & Clean-Up": "🧖",
  "Face Care": "🫧",
  "Threading & Waxing": "🧵",
  "Arm & Body Care": "💪",
  "Manicure & Pedicure": "💅",
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || "💈";
}

export function shouldShowServiceImage(service: Service | null | undefined): boolean {
  return !!(service && service.image_url && service.image_url.trim() !== "");
}

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "Hair Cuts": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
  "Beard & Shave": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80",
  "Hair Wash & Head Massage": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80",
  "Hair Spa": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
  "Hair Colour": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80",
  "Hair Color": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80",
  "Beard Colour": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80",
  "Beard Color": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80",
  "Hair Treatment": "https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=1200&q=80",
  "Hair Curling & Perm": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80",
  "Styling": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1200&q=80",
  "Facial & Clean-Up": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
  "Face Care": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80",
  "Threading & Waxing": "https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=1200&q=80",
  "Arm & Body Care": "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1200&q=80",
  "Manicure & Pedicure": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
};


