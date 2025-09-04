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

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges && !isNavigating) {
        event.preventDefault();
        // Show popup for browser navigation
        setIsOpen(true);
        // Restore the current URL
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, isNavigating, setIsOpen]);

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      setIsOpen(false);
      if (nextPath) {
        setIsNavigating(true);
        router.push(nextPath);
      }
    }
  };

  const handleDiscard = () => {
    onDiscard();
    setIsOpen(false);
    if (nextPath) {
      setIsNavigating(true);
      router.push(nextPath);
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
