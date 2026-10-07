import type { StaticImageData } from "next/image";
import coffee from "../../assets/images/coffee.jpg";
import sandwich from "../../assets/images/sandwich.jpg";
import softDrink from "../../assets/images/soft drink.jpg";
import cookies from "../../assets/images/cookies.jpg";
import bottledWater from "../../assets/images/bottled water.jpg";
import chocolate from "../../assets/images/chocolate.jpg";
import type { ProductId } from "../types/kiosk";

// Original local assets stay in place; Next.js emits optimized static imports.
export const productImages = {
  coffee, sandwich, "soft-drink": softDrink, cookies,
  "bottled-water": bottledWater, chocolate,
} satisfies Record<ProductId, StaticImageData>;
