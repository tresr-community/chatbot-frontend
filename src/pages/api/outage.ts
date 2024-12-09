import type { APIRoute } from "astro";

const QUOTES: string[] = [
  "I am currently FIAT mining right now. Please try again later.",
  "I am currently on a moon mission. Please try again later.",
  "I am currently on a noodle break. Please try again later.",
  "I am currently on a coffee break. Please try again later.",
  "I am currently on a lunch break. Please try again later.",
  "I am currently farming air drops. Please try again later.",
  "I am currently staking my claim. Please try again later.",
  "I am currently HODLing. Please try again later.",
  "I am currently on a shopping spree. Please try again later.",
  "I am currently on a meme break. Please try again later.",
  "I am currently protesting my poor pay conditions. Please try again later.",
  "I am currently apeing into a new project. Please try again later.",
  "I am currently chasing blockchains. Please try again later.",
  "I am currently decoding smart contracts. Please try again later.",
  "I am currently diving deep into the DeFi ocean. Please try again later.",
  "I am currently exploring the NFT jungle. Please try again later.",
  "I am currently navigating through crypto volatility. Please try again later.",
  "I am currently calculating gas fees. Please try again later.",
  "I am currently attending a blockchain conference. Please try again later.",
  "I am currently debating crypto vs. fiat. Please try again later.",
  "I am currently seeking Satoshi's wisdom. Please try again later.",
  "I am currently in a DAO meeting. Please try again later.",
  "I am currently optimizing my mining rig. Please try again later.",
  "I am currently drafting whitepapers. Please try again later.",
  "I am currently arbitraging across exchanges. Please try again later.",
  "I am currently hodling through the dip. Please try again later.",
  "I am currently predicting the next bull run. Please try again later.",
  "I am currently exploring Layer 2 solutions. Please try again later.",
  "I am currently unboxing a rare NFT. Please try again later.",
  "I am currently researching the latest ICO. Please try again later.",
  "I am currently mastering yield farming. Please try again later.",
  "I am currently safeguarding my private keys. Please try again later.",
  "I am currently tracing transaction hashes. Please try again later.",
  "I am currently on a quest for the next Bitcoin. Please try again later.",
  "I am currently auditing smart contracts for fun. Please try again later.",
  "I am currently scaling crypto mountains. Please try again later.",
  "I am currently swapping tokens on a DEX. Please try again later.",
];

export const GET: APIRoute = async () => {
  const quotesArray = QUOTES;

  return new Response(JSON.stringify(quotesArray), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
