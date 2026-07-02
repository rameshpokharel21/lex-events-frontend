export const DEFAULT_IMAGE_KEY = "city_center";

export const EVENT_IMAGES = [
  { key: "backyard",     label: "Backyard",      src: "/event-images/backyard.webp" },
  { key: "board-game",   label: "Board Game",    src: "/event-images/board-game.webp" },
  { key: "city_center",  label: "City Center",   src: "/event-images/city_center.webp" },
  { key: "cocktail",     label: "Cocktail",      src: "/event-images/cocktail.webp" },
  { key: "dohori",       label: "Dohori",        src: "/event-images/dohori.webp" },
  { key: "indoor_game",  label: "Indoor Game",   src: "/event-images/indoor_game.webp" },
  { key: "kabaddi",      label: "Kabaddi",       src: "/event-images/kabaddi.webp" },
  { key: "kite-flying",  label: "Kite Flying",   src: "/event-images/kite-flying.webp" },
  { key: "nepali_dance", label: "Nepali Dance",  src: "/event-images/nepali_dance.webp" },
  { key: "small_farm",   label: "Small Farm",    src: "/event-images/small_farm.webp" },
  { key: "social",       label: "Social",        src: "/event-images/social.webp" },
];

export const getEventImageSrc = (key) => {
  const resolved = key || DEFAULT_IMAGE_KEY;
  return EVENT_IMAGES.find((img) => img.key === resolved)?.src ?? null;
};
