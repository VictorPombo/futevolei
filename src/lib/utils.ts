export function capitalizeName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (["de", "da", "do", "das", "dos", "e"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
