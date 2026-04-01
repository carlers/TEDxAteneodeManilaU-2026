import { Inter, League_Gothic } from "next/font/google";

export const leagueGothic = League_Gothic({
  display: "swap",
  subsets: ["latin"],
  weight: "400",
  variable: "--font-league-gothic", 
});

export const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "800"],
  variable: "--font-inter",
});
