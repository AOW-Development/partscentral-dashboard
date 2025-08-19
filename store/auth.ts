import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  [key: string]: string | number | boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (
      set: (fn: (state: AuthState) => AuthState | Partial<AuthState>) => void
    ) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (user: User, token: string) =>
        set(() => ({
          user,
          token,
          isLoggedIn: true,
        })),
      // logout: () =>
      //   set(() => ({
      //     user: null,
      //     token: null,
      //     isLoggedIn: false,
      //   })),
      logout: () => {
        // Clear all auth-related data
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          // Clear any other auth-related items if they exist
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        // Update the state using the functional update pattern
        set(() => ({
          user: null,
          token: null,
          isLoggedIn: false,
        }));
      },
      setToken: (token: string) => set(() => ({ token })),
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthState) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
