import { redirect } from "next/navigation";

// The company page now lives at /azienda — keep the old URL working.
export default function ChiSiamoRedirect() {
  redirect("/azienda");
}
