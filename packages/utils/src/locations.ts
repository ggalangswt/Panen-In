import regencies from "./data/indonesia-regencies.json";

export type IndonesiaRegency = {
  id: string;
  provinceId: string;
  provinceName: string;
  kind: "kabupaten" | "kota" | "unknown";
  name: string;
  baseName: string;
  rawName: string;
};

function removeDiacritics(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeLocationText(value: string) {
  return removeDiacritics(value)
    .toLowerCase()
    .replace(/[.,/()-]/g, " ")
    .replace(/\b(kab)\.?\b/g, "kabupaten")
    .replace(/\b(kotamadya)\b/g, "kota")
    .replace(/\badm\.?\b/g, "administrasi")
    .replace(/\s+/g, " ")
    .trim();
}

function getAliases(regency: IndonesiaRegency) {
  const aliases = new Set<string>([
    regency.name,
    regency.baseName,
    regency.rawName,
    regency.provinceName,
    `${regency.kind} ${regency.baseName}`,
  ]);

  if (regency.kind === "kota") {
    aliases.add(`kota ${regency.baseName}`);
  }

  if (regency.kind === "kabupaten") {
    aliases.add(`kabupaten ${regency.baseName}`);
  }

  return [...aliases].map(normalizeLocationText);
}

export const indonesiaRegencies = regencies as IndonesiaRegency[];

const regenciesWithAliases = indonesiaRegencies.map((regency) => ({
  ...regency,
  aliases: getAliases(regency),
}));

export function getIndonesiaRegencies() {
  return indonesiaRegencies;
}

export function searchIndonesiaRegencies(query: string, limit = 12) {
  const normalizedQuery = normalizeLocationText(query);

  if (!normalizedQuery) {
    return indonesiaRegencies.slice(0, limit);
  }

  const startsWithMatches = regenciesWithAliases.filter((regency) =>
    regency.aliases.some((alias) => alias.startsWith(normalizedQuery)),
  );

  const containsMatches = regenciesWithAliases.filter(
    (regency) =>
      !startsWithMatches.some((match) => match.id === regency.id) &&
      regency.aliases.some((alias) => alias.includes(normalizedQuery)),
  );

  return [...startsWithMatches, ...containsMatches].slice(0, limit);
}

export function findIndonesiaRegencyByName(value: string) {
  const normalizedValue = normalizeLocationText(value);

  if (!normalizedValue) {
    return null;
  }

  const exactMatches = regenciesWithAliases.filter((regency) =>
    regency.aliases.includes(normalizedValue),
  );

  if (exactMatches.length === 1) {
    return exactMatches[0];
  }

  const startsWithMatches = regenciesWithAliases.filter((regency) =>
    regency.aliases.some((alias) => alias.startsWith(normalizedValue)),
  );

  if (startsWithMatches.length === 1) {
    return startsWithMatches[0];
  }

  return null;
}

export function findIndonesiaRegencyFromCandidates(candidates: string[]) {
  for (const candidate of candidates) {
    const match = findIndonesiaRegencyByName(candidate);

    if (match) {
      return match;
    }
  }

  const normalizedCandidates = candidates
    .map(normalizeLocationText)
    .filter(Boolean);

  for (const candidate of normalizedCandidates) {
    const baseNameMatches = regenciesWithAliases.filter(
      (regency) => normalizeLocationText(regency.baseName) === candidate,
    );

    if (baseNameMatches.length === 1) {
      return baseNameMatches[0];
    }
  }

  return null;
}
