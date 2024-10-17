export function formatWithoutDiacritics(string: string, useUpperCase: boolean) {
  if (!useUpperCase)
    return string.normalize("NFD").replace(/\u0300-\u036f]/g, "");
  return string
    .toUpperCase()
    .normalize("NFD")
    .replace(/\u0300-\u036f]/g, "");
}
