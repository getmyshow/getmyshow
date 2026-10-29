import { Metadata } from "next";
import CityDetailView from "@/components/city/CityDetailView";

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");

  return {
    title: `Events in ${formattedCity} — Passes, Seminars & Concerts | GetMyShow`,
    description: `Book tickets and passes for coaching seminars, college fests, cultural nights, and concerts in ${formattedCity}, Bihar. 2-click instant UPI checkout on GetMyShow.`,
    openGraph: {
      title: `Upcoming Events in ${formattedCity} — GetMyShow Box-Office`,
      description: `Discover and book passes for top events in ${formattedCity}, Bihar.`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  return <CityDetailView citySlug={city} />;
}
