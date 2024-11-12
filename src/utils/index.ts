export const parseDatasetSlug = (name: string) => {
  return name.replaceAll(" ", "_");
};

export const normalizeDatasetSlug = (slug: string) => {
  return slug.replaceAll("_", " ");
};

export const HOST_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://daxsome.owbird.site";
