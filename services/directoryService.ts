export interface Ally {
  readonly id: number;
  readonly name: string;
  readonly discount: string;
  readonly logo: string;
  readonly categoryId: number;
}

const getBacoConfig = (): any => {
  try {
    const raw = process.env.BACO;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Fetches all allies from the BACO API, resolving image URLs using the ecosystem BASE_DOMAIN.
 */
export async function getDirectoryAllies(): Promise<Ally[]> {
  const BACO = getBacoConfig();
  if (!BACO || !BACO.BASE_DOMAIN || !BACO.BENEFITS?.LIST) {
    console.error("[directoryService] BACO environment variables are not configured.");
    return [];
  }

  const baseUrl = BACO.BASE_DOMAIN.endsWith("/") ? BACO.BASE_DOMAIN : `${BACO.BASE_DOMAIN}/`;
  
  // 1. Fetch total count first to override pagination
  const countUrl = `${baseUrl}${BACO.BENEFITS.LIST}?categoryId=0`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Cache-Control": "no-cache",
  };

  if (BACO["X-API-KEY"]) {
    headers["X-API-KEY"] = BACO["X-API-KEY"];
  }

  try {
    const countResponse = await fetch(countUrl, {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    });

    if (!countResponse.ok) {
      throw new Error(`Failed to fetch allies count, status: ${countResponse.status}`);
    }

    const countJson = await countResponse.json();
    const dataCount = countJson.dataCount || 120;

    // 2. Fetch all allies using size=dataCount
    const listUrl = `${baseUrl}${BACO.BENEFITS.LIST}?categoryId=0&size=${dataCount}`;
    const listResponse = await fetch(listUrl, {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    });

    if (!listResponse.ok) {
      throw new Error(`Failed to fetch allies list, status: ${listResponse.status}`);
    }

    const listJson = await listResponse.json();
    const rawAllies = listJson.data || [];

    // 3. Map to simplified Ally format, resolving absolute logo URLs
    const allies: Ally[] = rawAllies.map((item: any) => {
      let logoUrl = "/images/prueba-logo-aliado2.png"; // Fallback logo
      if (item.imageLogo && item.imageLogo.original) {
        logoUrl = item.imageLogo.original.startsWith("http")
          ? item.imageLogo.original
          : `${baseUrl}${item.imageLogo.original}`;
      } else if (item.imageBenefit && item.imageBenefit.original) {
        logoUrl = item.imageBenefit.original.startsWith("http")
          ? item.imageBenefit.original
          : `${baseUrl}${item.imageBenefit.original}`;
      }

      const discount = item.discount || "";
      const lead = item.lead || "";
      let discountText = "";
      if (discount && lead) {
        discountText = `${discount} ${lead}`;
      } else {
        discountText = discount || lead || "Descuentos Especiales";
      }

      return {
        id: item.benefitId || item.alliedId,
        name: item.title || item.alliedName || "Aliado",
        discount: discountText,
        logo: logoUrl,
        categoryId: item.categoryId || 0,
      };
    });

    // 4. Sort alphabetically by name
    return allies.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  } catch (error: any) {
    console.error(`[directoryService] Error fetching allies:`, error.message);
    return [];
  }
}
