"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

// Hook to detect unsaved changes
export function useSaveChangesDetection(dependencies: any[] = []) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const currentUrlRef = useRef<string>("");
  const initialDataRef = useRef<string>("");
  const isInitializedRef = useRef(false);

  // Store initial state
  useEffect(() => {
    if (!isInitializedRef.current && dependencies.length > 0) {
      initialDataRef.current = JSON.stringify(dependencies);
      isInitializedRef.current = true;
    }
  }, []);

  // Detect changes
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const currentData = JSON.stringify(dependencies);
    const hasChanges = currentData !== initialDataRef.current;
    setHasUnsavedChanges(hasChanges);
  }, [JSON.stringify(dependencies)]);

  // Browser close/refresh warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Navigation interception
  useEffect(() => {
    currentUrlRef.current = window.location.href;

    const handlePopState = (event: PopStateEvent) => {
      if (!hasUnsavedChanges || isNavigating) return;
      
      event.preventDefault();
      setNextPath("back");
      setIsSaveDialogOpen(true);
      
      window.history.pushState(
        { preventNavigation: true },
        "",
        currentUrlRef.current
      );
    };

    const handleLinkClick = (event: MouseEvent) => {
      if (!hasUnsavedChanges || isNavigating) return;

      const target = event.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;
      
      if (!link) return;

      const href = link.getAttribute("href");
      if (
        href &&
        href !== pathname &&
        !href.startsWith("#") &&
        !link.target
      ) {
        event.preventDefault();
        event.stopPropagation();
        setNextPath(href);
        setIsSaveDialogOpen(true);
      }
    };

    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;

    (router as any).push = (href: string, options?: any) => {
      if (hasUnsavedChanges && !isNavigating) {
        setNextPath(href);
        setIsSaveDialogOpen(true);
        return Promise.resolve(false);
      }
      return originalPush.call(router, href, options);
    };

    (router as any).replace = (href: string, options?: any) => {
      if (hasUnsavedChanges && !isNavigating) {
        setNextPath(href);
        setIsSaveDialogOpen(true);
        return Promise.resolve(false);
      }
      return originalReplace.call(router, href, options);
    };

    (router as any).back = () => {
      if (hasUnsavedChanges && !isNavigating) {
        setNextPath("back");
        setIsSaveDialogOpen(true);
        return;
      }
      return originalBack.call(router);
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick, true);
      (router as any).push = originalPush;
      (router as any).replace = originalReplace;
      (router as any).back = originalBack;
    };
  }, [hasUnsavedChanges, isNavigating, router, pathname]);

  const handleSave = async (saveCallback: () => Promise<boolean>) => {
    try {
      const success = await saveCallback();
      
      if (success) {
        // Update the baseline with current data after successful save
        initialDataRef.current = JSON.stringify(dependencies);
        setHasUnsavedChanges(false);
        setIsSaveDialogOpen(false);

        if (nextPath) {
          setIsNavigating(true);
          setTimeout(() => {
            if (nextPath === "back") {
              window.history.back();
            } else {
              router.push(nextPath);
            }
            setNextPath(null);
            setIsNavigating(false);
          }, 100);
        }
      }
      return success;
    } catch (error) {
      console.error("Error saving changes:", error);
      return false;
    }
  };

  const handleDiscard = () => {
    setHasUnsavedChanges(false);
    setIsSaveDialogOpen(false);

    if (nextPath) {
      setIsNavigating(true);
      setTimeout(() => {
        if (nextPath === "back") {
          window.history.go(-2);
        } else {
          router.push(nextPath);
        }
        setNextPath(null);
        setIsNavigating(false);
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsSaveDialogOpen(false);
    setNextPath(null);
  };

  // Function to manually reset the baseline (call after successful save)
  const markAsSaved = () => {
    initialDataRef.current = JSON.stringify(dependencies);
    setHasUnsavedChanges(false);
  };

  return {
    hasUnsavedChanges,
    isSaveDialogOpen,
    handleSave,
    handleDiscard,
    handleCancel,
    markAsSaved, // Export this so you can call it after save
  };
}

// Dialog Component
interface SaveChangesDialogProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function SaveChangesDialog({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
}: SaveChangesDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unsaved Changes
            </h2>
            <p className="text-gray-600 text-sm">
              You have unsaved changes that will be lost if you leave this page.
              Would you like to save your changes before continuing?
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm font-medium border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}