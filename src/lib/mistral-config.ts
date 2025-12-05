/**
 * Mistral AI Configuration
 * Centralized configuration for Mistral API access
 */

export const MISTRAL_API_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || "nJCcmgS1lSo13OVE79Q64QndL3nCDjQI";
export const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Mistral API Models
 */
export const MISTRAL_MODELS = {
  CHAT: "mistral-large-latest", // Best for conversational AI
  FAST: "open-mistral-nemo", // Fast and cost-effective
  MEDIUM: "open-mistral-7b", // Balanced performance
} as const;

