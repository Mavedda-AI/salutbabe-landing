"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function LegacyAdminUsers() {
  const router = useRouter();
  useEffect(() => {
    router.push("/panel/admin/users");
  }, [router]);
  return null;
}
