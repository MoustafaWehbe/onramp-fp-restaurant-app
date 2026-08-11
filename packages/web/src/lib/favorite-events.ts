export const FAVORITE_ADDED_EVENT = "favorite-added";

export function notifyFavoriteAdded() {
  window.dispatchEvent(new Event(FAVORITE_ADDED_EVENT));
}