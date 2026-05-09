import { getDeviceType } from "@/lib/device";
import { DesktopHomePage } from "@/components/desktop/DesktopHomePage";
import { HeroBanner } from "@/components/HeroBanner";
import { FilterBar } from "@/components/FilterBar";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/types/database";

interface Props {
  products: Product[];
  currentUserId?: string;
  activeCategory?: string;
  activeSort?: string;
}

// Server Component — renders the right home layout based on device cookie
export async function HomePageRouter({ products, currentUserId, activeCategory, activeSort }: Props) {
  const device = await getDeviceType();

  if (device === "desktop") {
    return <DesktopHomePage products={products} currentUserId={currentUserId} />;
  }

  return (
    <>
      <HeroBanner />
      <FilterBar activeCategory={activeCategory} activeSort={activeSort} />
      <ProductGrid products={products} currentUserId={currentUserId} />
    </>
  );
}
