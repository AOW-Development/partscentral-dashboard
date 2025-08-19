"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

export default function ProtectRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // This effect only runs on the client side
    const checkAuth = () => {
      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (!authStorage) {
          router.replace("/login");
          return;
        }

        const authState = JSON.parse(authStorage);
        if (!authState?.state?.isLoggedIn) {
          router.replace("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isLoggedIn, isLoading, isAuthenticated]);

  if (typeof window === "undefined" || isLoading) {
    return null; // Or a loading spinner
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
