export const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatMonth = (month) => {
  const [year, value] = month.split("-").map(Number);
  return new Date(year, value - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

export const CATEGORY_COLORS = {
  Food: "#E4572E",
  Transport: "#2E9C82",
  Shopping: "#B08968",
  Bills: "#4C6EF5",
  Entertainment: "#C77DFF",
  Health: "#1E9E6B",
  Other: "#8A8F87",
};
