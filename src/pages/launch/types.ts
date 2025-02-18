export interface TwitterConfig {
  username: string;
  email: string;
  password: string;
}

export interface TelegramConfig {
  bot_secret: string;
  username: string;
}

export interface Person {
  name: string;
  platform: "twitter" | "telegram";
}

export interface AgentSettings {
  name: string;
  ticker: string;
  bio: string;
  knowledge: string[];
  style: string[];
  enabledPlatforms: string[];
  twitterConfig: TwitterConfig;
  telegramConfig: TelegramConfig;
  twitterStyles: string[];
  telegramStyles: string[];
  buyAmount: string;
  image?: File;
}

export interface LaunchResponse {
  id: number;
  mint: string;
  transaction: string;
}
