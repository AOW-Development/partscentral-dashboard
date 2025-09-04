"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SaveChangesPopUpProps {
  hasUnsavedChanges: boolean;
  onSave: () => Promise<boolean> | boolean;
  onDiscard: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  message?: string;
  saveButtonText?: string;
  discardButtonText?: string;
}

export default function SaveChangesPopUp({
  hasUnsavedChanges,
  onSave,
  onDiscard,
  isOpen,
  setIsOpen,
  message = "You have unsaved changes. Are you sure you want to leave this page?",
  saveButtonText = "Save Changes",
  discardButtonText = "Discard Changes",
}: SaveChangesPopUpProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);

  // Handle browser tab/window close or refresh
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle all navigation attempts
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Handle browser back/forward navigation
    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges && !isNavigating) {
        event.preventDefault();
        // Show popup for browser navigation
        setIsOpen(true);
        // Restore the current URL
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    // Handle Link component clicks and button navigation
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check for Link components (Next.js Link)
      const link = target.closest("a[href]") as HTMLAnchorElement;
      if (link && hasUnsavedChanges && !isNavigating) {
        const href = link.getAttribute("href");
        if (
          href &&
          href !== window.location.pathname &&
          !href.startsWith("#")
        ) {
          event.preventDefault();
          setNextPath(href);
          setIsOpen(true);
          return;
        }
      }

      // Check for buttons that might trigger navigation
      const button = target.closest("button") as HTMLButtonElement;
      if (button && hasUnsavedChanges && !isNavigating) {
        // Check if button has navigation-related attributes or classes
        const buttonText = button.textContent?.toLowerCase() || "";
        const buttonClass = button.className || "";

        // Common navigation button patterns
        const isNavigationButton =
          buttonText.includes("orders") ||
          buttonText.includes("leads") ||
          buttonText.includes("production") ||
          buttonText.includes("dashboard") ||
          buttonText.includes("home") ||
          buttonClass.includes("nav") ||
          buttonClass.includes("menu");

        if (isNavigationButton) {
          // Try to find the intended destination from button context
          const parentLink = button.closest("a[href]");
          if (parentLink) {
            const href = parentLink.getAttribute("href");
            if (href && href !== window.location.pathname) {
              event.preventDefault();
              setNextPath(href);
              setIsOpen(true);
            }
          }
        }
      }
    };

    // Handle programmatic navigation (router.push, router.replace)
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (href: string) => {
      if (hasUnsavedChanges && !isNavigating) {
        setNextPath(href);
        setIsOpen(true);
        return Promise.resolve(false);
      }
      return originalPush.call(router, href);
    };

    router.replace = (href: string) => {
      if (hasUnsavedChanges && !isNavigating) {
        setNextPath(href);
        setIsOpen(true);
        return Promise.resolve(false);
      }
      return originalReplace.call(router, href);
    };

    // Handle hash changes (for single-page app navigation)
    const handleHashChange = (event: HashChangeEvent) => {
      if (hasUnsavedChanges && !isNavigating) {
        event.preventDefault();
        setIsOpen(true);
        // Restore the current hash
        window.location.hash = window.location.hash;
      }
    };

    // Handle direct URL changes (when user types in address bar)
    const handleLocationChange = () => {
      if (hasUnsavedChanges && !isNavigating) {
        // This is a fallback for direct URL changes
        // We can't prevent them completely, but we can warn
        // const shouldLeave = window.confirm(
        //   "You have unsaved changes. Are you sure you want to leave this page?"
        // );
        setIsOpen(true);
        const shouldLeave = true;
        if (!shouldLeave) {
          // Try to restore the previous URL
          window.history.pushState(null, "", window.location.pathname);
        }
      }
    };

    // Handle keyboard navigation (Alt+Left, Alt+Right, etc.)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (hasUnsavedChanges && !isNavigating) {
        // Alt + Left Arrow (Back)
        if (event.altKey && event.key === "ArrowLeft") {
          event.preventDefault();
          setIsOpen(true);
          setNextPath("back");
        }
        // Alt + Right Arrow (Forward)
        if (event.altKey && event.key === "ArrowRight") {
          event.preventDefault();
          setIsOpen(true);
          setNextPath("forward");
        }
      }
    };

    // Add event listeners
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleLinkClick, true); // Use capture phase
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleLinkClick, true);
      document.removeEventListener("keydown", handleKeyDown);
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [hasUnsavedChanges, isNavigating, setIsOpen, router]);

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      setIsOpen(false);
      if (nextPath) {
        setIsNavigating(true);
        if (nextPath === "back") {
          window.history.back();
        } else if (nextPath === "forward") {
          window.history.forward();
        } else {
          router.push(nextPath);
        }
      }
    }
  };

  const handleDiscard = () => {
    onDiscard();
    setIsOpen(false);
    if (nextPath) {
      setIsNavigating(true);
      if (nextPath === "back") {
        window.history.back();
      } else if (nextPath === "forward") {
        window.history.forward();
      } else {
        router.push(nextPath);
      }
    }
  };

  // Simple modal implementation that works without shadcn/ui
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-2">Unsaved Changes</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {discardButtonText}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
