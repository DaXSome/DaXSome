/**
 * Given a dataset name, return the slug version of the name. This is done by replacing all spaces with underscores.
 * @param name The dataset name to parse.
 * @returns The slug version of the dataset name.
 */
export const parseDatasetSlug = (name: string) => {
  return name.toLowerCase().replaceAll(" ", "_");
};

/**
 * Given a dataset slug, return the normalized version of the slug. This is done by replacing all underscores with spaces.
 * @param slug The dataset slug to normalize.
 * @returns The normalized dataset slug.
 */
export const normalizeDatasetSlug = (slug: string) => {
  return slug.toLowerCase().replaceAll("_", " ");
};

export const HOST_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://daxsome.org";

export const supportedDataTypes = ['string', 'number', 'boolean']

export const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#d0ed57",
  "#8dd1e1",
  "#a4de6c",
  "#d084d8",
  "#f3a683",
  "#ff6f61",
  "#2ec4b6",
  "#e71d36",
  "#011627",
  "#ff9f1c",
  "#6a4c93",
  "#d90368",
  "#bc5090",
  "#ff6361",
  "#ffa600",
  "#003f5c",
  "#7a5195",
  "#ef5675",
  "#ffa07a",
  "#4682b4",
  "#b0e57c",
  "#ffb3ba",
  "#bae1ff",
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#e67e22",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#f1c40f",
  "#d35400",
  "#c0392b",
  "#7f8c8d",
  "#34495e",
  "#2c3e50",
  "#5dade2",
  "#ec7063",
  "#af7ac5",
  "#45b39d",
  "#f5cba7",
  "#5d6d7e",
  "#eb984e",
  "#abebc6",
  "#85c1e9",
  "#f1948a",
];
