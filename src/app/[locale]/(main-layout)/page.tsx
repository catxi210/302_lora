import { redirect } from "@/i18n/routing";

export default function Home({ params }: { params: { locale: string } }) {
  return redirect({ href: "/loras", locale: params.locale });
}
