"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import Loading from "@/app/loading";

export function UserStoreInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        let res = await fetch("/api/users/me");

        // If access token is expired, attempt auto-refresh
        if (res.status === 401) {
          const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
          if (refreshRes.ok) {
            res = await fetch("/api/users/me");
          }
        }

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setUser(data.data);
          } else {
            clearUser();
          }
        } else {
          clearUser();
        }
      } catch (err) {
        clearUser();
      } finally {
        setIsInitializing(false);
      }
    }

    fetchCurrentUser();
  }, [setUser, clearUser]);

  if (isInitializing) {
    return <Loading />;
  }

  return <>{children}</>;
}
