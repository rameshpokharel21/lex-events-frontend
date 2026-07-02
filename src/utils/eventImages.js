export const DEFAULT_IMAGE_KEY = "city_center";

export const EVENT_IMAGES = [
  { key: "backyard",     label: "Backyard",      src: "/event-images/backyard.png" },
  { key: "board-game",   label: "Board Game",    src: "/event-images/board-game.png" },
  { key: "city_center",  label: "City Center",   src: "/event-images/city_center.png" },
  { key: "cocktail",     label: "Cocktail",      src: "/event-images/cocktail.png" },
  { key: "dohori",       label: "Dohori",        src: "/event-images/dohori.png" },
  { key: "indoor_game",  label: "Indoor Game",   src: "/event-images/indoor_game.png" },
  { key: "kabaddi",      label: "Kabaddi",       src: "/event-images/kabaddi.png" },
  { key: "kite-flying",  label: "Kite Flying",   src: "/event-images/kite-flying.png" },
  { key: "nepali_dance", label: "Nepali Dance",  src: "/event-images/nepali_dance.png" },
  { key: "small_farm",   label: "Small Farm",    src: "/event-images/small_farm.png" },
  { key: "social",       label: "Social",        src: "/event-images/social.png" },
];

export const getEventImageSrc = (key) => {
  const resolved = key || DEFAULT_IMAGE_KEY;
  return EVENT_IMAGES.find((img) => img.key === resolved)?.src ?? null;
};
