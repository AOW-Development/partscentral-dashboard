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
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
      return "You have unsaved changes. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle all navigation attempts
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Add a history entry to intercept back/forward navigation
    const currentUrl = window.location.href;
    window.history.pushState(
      { preventNavigation: true, timestamp: Date.now() },
      "",
      currentUrl
    );

    // Handle browser back/forward navigation
    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges && !isNavigating) {
        // Show popup for browser navigation
        setIsOpen(true);
        // Determine if it's back or forward navigation
        const isBackNavigation = event.state?.preventNavigation === true;
        setNextPath(isBackNavigation ? "back" : "forward");
        // Push current state back to prevent navigation
        window.history.pushState(
          { preventNavigation: true, timestamp: Date.now() },
          "",
          currentUrl
        );
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
          event.stopPropagation();
          console.log("href", href);

          // Set the nextPath to the actual href for proper navigation
          if (href.includes("orders") && href.includes("dashboard")) {
            setNextPath("https://partscentral.us/dashboard/orders");
          } else if (href.includes("leads") && href.includes("dashboard")) {
            setNextPath("https://partscentral.us/dashboard/leads");
          } else if (
            href.includes("production") &&
            href.includes("dashboard")
          ) {
            setNextPath("https://partscentral.us/dashboard/production");
          } else if (href.includes("dashboard")) {
            setNextPath("https://partscentral.us/dashboard");
          } else {
            setNextPath(href);
          }
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
          console.log("parentLink", parentLink);
          if (parentLink) {
            const href = parentLink.getAttribute("href");
            console.log("href1", href);
            if (href && href !== window.location.pathname) {
              event.preventDefault();
              event.stopPropagation();
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
        console.log("href2", href);
        setNextPath(href);
        setIsOpen(true);
        return Promise.resolve(false);
      }
      return originalPush.call(router, href);
    };

    router.replace = (href: string) => {
      if (hasUnsavedChanges && !isNavigating) {
        console.log("href3", href);
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
          event.stopPropagation();
          setIsOpen(true);
          setNextPath("back");
        }
        // Alt + Right Arrow (Forward)
        if (event.altKey && event.key === "ArrowRight") {
          event.preventDefault();
          event.stopPropagation();
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

      // Clean up the history state if it exists
      if (window.history.state?.preventNavigation) {
        window.history.replaceState(null, "", window.location.href);
      }
    };
  }, [hasUnsavedChanges, isNavigating, setIsOpen, router]);

  // Clean up history state when hasUnsavedChanges becomes false
  useEffect(() => {
    if (!hasUnsavedChanges && window.history.state?.preventNavigation) {
      window.history.replaceState(null, "", window.location.href);
    }
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      setIsOpen(false);
      if (nextPath) {
        setIsNavigating(true);
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          if (nextPath === "back") {
            // Go back by removing our dummy state and going back twice
            window.history.go(-1);
          } else if (nextPath === "forward") {
            // Go forward by removing our dummy state and going forward
            window.history.go(1);
          } else {
            router.push(nextPath);
          }
          setNextPath(null);
          setIsNavigating(false);
        }, 500);
      }
    }
  };

  const handleDiscard = () => {
    onDiscard();
    setIsOpen(false);
    if (nextPath) {
      setIsNavigating(true);
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        if (nextPath === "back") {
          // Go back by removing our dummy state and going back twice
          window.history.go(-2);
        } else if (nextPath === "forward") {
          // Go forward by removing our dummy state and going forward
          window.history.go(1);
        } else {
          router.push(nextPath);
        }
        setNextPath(null);
        setIsNavigating(false);
      }, 100);
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
