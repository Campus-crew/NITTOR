"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentUser } from "@/lib/hooks";

/**
 * Project Provider - синхронизирует пользователя с глобальным стором
 */
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return <>{children}</>;
}
