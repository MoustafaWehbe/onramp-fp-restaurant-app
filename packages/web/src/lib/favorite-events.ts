export const FAVORITE_ADDED_EVENT = "favorite-added";
export const FAVORITE_REMOVED_EVENT = "favorite-removed";

export function notifyFavoriteAdded() {
  window.dispatchEvent(new Event(FAVORITE_ADDED_EVENT));
}

export function notifyFavoriteRemoved(slug: string) {
  window.dispatchEvent(
    new CustomEvent(FAVORITE_REMOVED_EVENT, {
      detail: { slug },
    })
  );
}