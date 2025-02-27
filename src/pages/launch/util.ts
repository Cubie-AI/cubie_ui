import { toast } from "sonner";
import { AgentSettings } from "./types";

export function validateAgentSettings(settings: AgentSettings) {
  const required = ["name", "ticker", "bio", "buyAmount", "image"];
  const missing: string[] = [];
  required.forEach((field) => {
    if (!settings[field as keyof AgentSettings]) {
      missing.push(field);
    }
  });

  console.log(missing);
  if (missing.length > 0) {
    toast.error(`Missing required fields: ${missing.join(", ")}`);
    return false;
  }

  const { enabledPlatforms, twitterConfig, telegramConfig } = settings;
  if (enabledPlatforms.length === 0) {
    toast.error("At least one platform must be enabled");
    return false;
  }

  if (enabledPlatforms.length > 1) {
    if (
      enabledPlatforms.includes("twitter") &&
      (!twitterConfig ||
        !twitterConfig.username ||
        !twitterConfig.email ||
        !twitterConfig.password)
    ) {
      toast.error("Twitter config is missing");
      return false;
    }

    if (
      enabledPlatforms.includes("telegram") &&
      (!telegramConfig || !telegramConfig.botToken || !telegramConfig.username)
    ) {
      toast.error("Telegram config is missing");
      return false;
    }
  }

  return true;
}

function addOptionalArrayField<T>(formData: FormData, key: string, value: T[]) {
  const stringified = (value || []).map((item) => JSON.stringify(item));
  if (value.length > 0) {
    stringified.forEach((item, index) => {
      if (item && item.length > 0) {
        formData.append(`${key}[${index}]`, item);
      }
    });
  }
}

export function buildAgentFormData(settings: AgentSettings) {
  if (!validateAgentSettings(settings)) {
    return null;
  }
  const formData = new FormData();
  formData.append("name", settings.name);
  formData.append("ticker", settings.ticker);
  formData.append("bio", settings.bio);
  formData.append("platform", settings.platform);
  formData.append("api", settings.api);
  formData.append("devBuy", settings.buyAmount);
  if (settings.image) {
    formData.append("image", settings.image);
  }
  addOptionalArrayField(formData, "knowledge", settings.knowledge);
  addOptionalArrayField(formData, "style", settings.style);
  addOptionalArrayField(formData, "twitterStyles", settings.twitterStyles);
  addOptionalArrayField(formData, "telegramStyles", settings.telegramStyles);

  if (settings.enabledPlatforms.includes("twitter")) {
    formData.append("twitterConfig", JSON.stringify(settings.twitterConfig));
  }
  if (settings.enabledPlatforms.includes("telegram")) {
    formData.append("telegramConfig", JSON.stringify(settings.telegramConfig));
  }

  return formData;
}
