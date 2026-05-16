import { redirect } from "next/navigation";

import { AppRoutes } from "@/constants/routes";

export default function LegacyLoginPage() {
  redirect(AppRoutes.login);
}
