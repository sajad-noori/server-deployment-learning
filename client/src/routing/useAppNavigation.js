import { useCallback, useEffect, useState } from "react";

const DEFAULT_ROUTE = { view: "dashboard", lessonId: null };

export function readAppRoute(location = window.location) {
  const hash = location.hash.replace(/^#\/?/, "");

  if (hash.startsWith("lesson/")) {
    const lessonId = decodeURIComponent(hash.slice("lesson/".length));
    return lessonId ? { view: "lesson", lessonId } : DEFAULT_ROUTE;
  }

  if (hash === "practice" || hash === "guide" || hash === "dashboard") {
    return { view: hash, lessonId: null };
  }

  return DEFAULT_ROUTE;
}

function routeToHash(route) {
  if (route.view === "lesson" && route.lessonId) {
    return `#lesson/${encodeURIComponent(route.lessonId)}`;
  }

  if (route.view === "practice" || route.view === "guide") {
    return `#${route.view}`;
  }

  return "#dashboard";
}

/**
 * Keeps the visible application page synchronized with the URL.
 * A URL is the source of truth, so refreshes and browser history work.
 */
export function useAppNavigation() {
  const [route, setRoute] = useState(() => readAppRoute());

  useEffect(() => {
    const restoreRoute = () => setRoute(readAppRoute());
    window.addEventListener("popstate", restoreRoute);
    window.addEventListener("hashchange", restoreRoute);

    return () => {
      window.removeEventListener("popstate", restoreRoute);
      window.removeEventListener("hashchange", restoreRoute);
    };
  }, []);

  const navigate = useCallback((nextRoute, { replace = false } = {}) => {
    const normalizedRoute =
      nextRoute.view === "lesson" && nextRoute.lessonId
        ? { view: "lesson", lessonId: nextRoute.lessonId }
        : { view: nextRoute.view || "dashboard", lessonId: null };

    const hash = routeToHash(normalizedRoute);
    const method = replace ? "replaceState" : "pushState";

    window.history[method](
      { deployLabRoute: normalizedRoute },
      "",
      `${window.location.pathname}${window.location.search}${hash}`
    );

    setRoute(normalizedRoute);
  }, []);

  return { route, navigate };
}
