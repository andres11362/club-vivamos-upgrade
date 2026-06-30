import HomeTemplate from "@/components/template/home";
import { cookies } from "next/headers";
import { getFeaturedBySegment, getCustomBlocks } from "@/services/homeService";

export default async function Home() {
  const cookieStore = await cookies();
  const prefix = process.env.COOKIE_PREFIX ?? "";
  const authCookie = cookieStore.get(`${prefix}auth`);

  let segmentId = 2; // Default segment (Classics)
  if (authCookie) {
    try {
      const session = JSON.parse(decodeURIComponent(authCookie.value));
      if (session.authenticated && session.user?.segmentId) {
        segmentId = Number(session.user.segmentId);
      }
    } catch (e) {
      console.error("Error reading auth cookie on Home page server:", e);
    }
  }

  // Fetch featured benefits and advertising blocks in parallel on the server (SSR)
  const [featuredBenefits, customBlocks] = await Promise.all([
    getFeaturedBySegment(segmentId).catch((err) => {
      console.error("Error loading featured benefits on server:", err);
      return []; // Return empty list as safe fallback
    }),
    getCustomBlocks().catch((err) => {
      console.error("Error loading custom blocks on server:", err);
      return [];
    })
  ]);

  return (
    <HomeTemplate 
      initialFeatured={featuredBenefits} 
      initialBlocks={customBlocks} 
    />
  );
}
