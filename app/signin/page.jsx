import SignInForm from "@/components/SignInForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  if (await getServerSession(authOptions)) redirect("/");
  return <SignInForm />;
}
