"use client";

import { useCurrentUser } from "@/lib/hooks";
import { tokenManager } from "@/lib/api/client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

/**
 * Debug компонент для проверки состояния авторизации
 * Показывает токен и данные пользователя
 * Удалите в production!
 */
export function AuthDebug() {
  const { data: user, isLoading, error } = useCurrentUser();
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken(tokenManager.getToken());
  }, []);

  if (process.env.NODE_ENV === "production" || !mounted) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-md border-yellow-500 bg-yellow-950/90 p-4 text-xs">
      <h3 className="mb-2 font-bold text-yellow-300">🐛 Auth Debug</h3>
      
      <div className="space-y-2 text-yellow-200">
        <div>
          <strong>Token:</strong>{" "}
          {token ? `${token.substring(0, 20)}...` : "❌ No token"}
        </div>
        
        <div>
          <strong>User Loading:</strong> {isLoading ? "⏳ Yes" : "✅ No"}
        </div>
        
        <div>
          <strong>User Error:</strong> {error ? `❌ ${error.message}` : "✅ No"}
        </div>
        
        <div>
          <strong>User Data:</strong>{" "}
          {user ? (
            <div className="ml-2 mt-1">
              <div>ID: {user.id}</div>
              <div>Email: {user.email}</div>
              <div>Credits: {user.credits}</div>
            </div>
          ) : (
            "❌ No user"
          )}
        </div>
        
        <div className="mt-2 border-t border-yellow-700 pt-2">
          <strong>LocalStorage:</strong>
          <div className="ml-2 mt-1">
            <div>access_token: {typeof window !== "undefined" && localStorage.getItem("access_token") ? "✅ Exists" : "❌ Missing"}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
