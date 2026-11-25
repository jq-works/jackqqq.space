"use cache";

import { SITE } from '@/lib/site';

// Server component: Cache Components forbids new Date() in client components.
export async function Copyright() {
  return <p>© {new Date().getFullYear()} {SITE.brand}</p>;
}
