import { Block } from "@blocknote/core";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const swrFetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json()).catch(e => console.error(e));

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Removes items from the content list that have no text content
 * @param contentList - The list of content items to filter
 * @returns A new array with empty content items removed
 */
export const removeEmptyContentItems = (contentList: Block[]): Block[] => {
  return contentList.filter((item) => {
    // Check if content array exists and has items
    if (
      !item.content ||
      !Array.isArray(item.content) ||
      item.content.length === 0
    ) {
      return false;
    }

    // Check if any content item has non-empty text
    return item.content.some(
      (contentItem) =>
        contentItem.type === "text" &&
        contentItem.text &&
        contentItem.text.trim() !== "",
    );
  });
};
