"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "./types";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionData = async (): Promise<User | null> => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  };

  const refetchSession = useCallback(async () => {
    setLoading(true);
    const userData = await fetchSessionData();
    setUser(userData);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchSessionData().then((userData) => {
      if (isMounted) {
        setUser(userData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, refetchSession };
}
