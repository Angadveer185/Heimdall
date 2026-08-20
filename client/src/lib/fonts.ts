import { Chakra_Petch, Zen_Old_Mincho, Azeret_Mono } from "next/font/google";

export const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chakra-petch",
});

export const zenOldMincho = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-zen-old-mincho",
});

export const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-azeret-mono",
});