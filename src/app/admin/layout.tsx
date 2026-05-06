"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect old /admin routes to /panel
    router.push("/panel");
  }, [router]);

  return null;
}
