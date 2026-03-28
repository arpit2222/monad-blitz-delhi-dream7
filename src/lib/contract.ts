export const DREAM7_ADDRESS = "0x46C67e8ba1B9b13Cb62E52c8BFCFc93C96431321" as `0x${string}`;

export const DREAM7_ABI = [
  // createMarket
  {
    name: "createMarket",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "question", type: "string" },
      { name: "category", type: "string" },
      { name: "deadline", type: "uint256" },
      { name: "minBet", type: "uint256" },
      { name: "maxBet", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  // betYes
  {
    name: "betYes",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [],
  },
  // betNo
  {
    name: "betNo",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [],
  },
  // resolveMarket
  {
    name: "resolveMarket",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcomeYes", type: "bool" },
    ],
    outputs: [],
  },
  // claim
  {
    name: "claim",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [],
  },
  // getMarket
  {
    name: "getMarket",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "question", type: "string" },
          { name: "category", type: "string" },
          { name: "deadline", type: "uint256" },
          { name: "yesPool", type: "uint256" },
          { name: "noPool", type: "uint256" },
          { name: "resolved", type: "bool" },
          { name: "outcomeYes", type: "bool" },
          { name: "minBet", type: "uint256" },
          { name: "maxBet", type: "uint256" },
          { name: "creator", type: "address" },
        ],
      },
    ],
  },
  // getUserBets
  {
    name: "getUserBets",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [
      { name: "yesBet", type: "uint256" },
      { name: "noBet", type: "uint256" },
    ],
  },
  // getOdds
  {
    name: "getOdds",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [
      { name: "yesOddsBps", type: "uint256" },
      { name: "noOddsBps", type: "uint256" },
    ],
  },
  // totalMarkets
  {
    name: "totalMarkets",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  // claimed
  {
    name: "claimed",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  // hasBet
  {
    name: "hasBet",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  // estimatePayout
  {
    name: "estimatePayout",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" },
      { name: "forYes", type: "bool" },
    ],
    outputs: [{ type: "uint256" }],
  },
  // admin
  {
    name: "admin",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  // setAdmin
  {
    name: "setAdmin",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "newAdmin", type: "address" }],
    outputs: [],
  },
  // Events
  {
    name: "MarketCreated",
    type: "event",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "question", type: "string", indexed: false },
      { name: "category", type: "string", indexed: false },
      { name: "deadline", type: "uint256", indexed: false },
      { name: "minBet", type: "uint256", indexed: false },
      { name: "maxBet", type: "uint256", indexed: false },
    ],
  },
  {
    name: "BetPlaced",
    type: "event",
    inputs: [
      { name: "marketId", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "isYes", type: "bool", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "MarketResolved",
    type: "event",
    inputs: [
      { name: "marketId", type: "uint256", indexed: true },
      { name: "outcomeYes", type: "bool", indexed: false },
    ],
  },
  {
    name: "WinningsClaimed",
    type: "event",
    inputs: [
      { name: "marketId", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

export interface Market {
  id: bigint;
  question: string;
  category: string;
  deadline: bigint;
  yesPool: bigint;
  noPool: bigint;
  resolved: boolean;
  outcomeYes: boolean;
  minBet: bigint;
  maxBet: bigint;
  creator: `0x${string}`;
}
