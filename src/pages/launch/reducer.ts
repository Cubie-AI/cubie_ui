import { AgentSettings, TelegramConfig, TwitterConfig } from "./types";

type FieldAction = {
  name: keyof AgentSettings | keyof TwitterConfig | keyof TelegramConfig;
  value:
    | AgentSettings[keyof AgentSettings]
    | TwitterConfig[keyof TwitterConfig]
    | TelegramConfig[keyof TelegramConfig];
};

type BaseArrayFieldAction = {
  name: keyof Pick<
    AgentSettings,
    | "knowledge"
    | "style"
    | "twitterStyles"
    | "telegramStyles"
    | "people"
    | "enabledPlatforms"
  >;
};

type AddArrayFieldAction = BaseArrayFieldAction & {
  value: string;
};

type UpdateArrayFieldAction = BaseArrayFieldAction & {
  value: string;
  index: number;
};

type RemoveArrayFieldAction = BaseArrayFieldAction & {
  index: number;
};

type AgentAction =
  | { type: "set_field"; payload: FieldAction }
  | { type: "add_array_item"; payload: AddArrayFieldAction }
  | { type: "remove_array_item"; payload: RemoveArrayFieldAction }
  | { type: "update_array_item"; payload: UpdateArrayFieldAction }
  | { type: "set_image"; payload: File }
  | { type: "set_twitter_config"; payload: FieldAction }
  | { type: "set_telegram_config"; payload: FieldAction };

export function agentReducer(
  state: AgentSettings,
  action: AgentAction
): AgentSettings {
  const { type, payload } = action;
  if (type === "set_field") {
    return { ...state, [action.payload.name]: action.payload.value };
  } else if (type === "add_array_item") {
    const prev = state[payload.name];
    return { ...state, [payload.name]: [...prev, payload.value] };
  } else if (type === "remove_array_item") {
    const prev = state[payload.name];
    return {
      ...state,
      [payload.name]: prev.filter((_, i) => i !== payload.index),
    };
  } else if (type === "update_array_item") {
    const prev = state[payload.name];
    return {
      ...state,
      [payload.name]: prev.map((item, i) =>
        i === payload.index ? payload.value : item
      ),
    };
  } else if (type === "set_twitter_config") {
    const twitterConfig = {
      ...state.twitterConfig,
      [payload.name]: payload.value,
    };
    return {
      ...state,
      twitterConfig,
    };
  } else if (type === "set_telegram_config") {
    const telegramConfig = {
      ...state.telegramConfig,
      [payload.name]: payload.value,
    };
    return {
      ...state,
      telegramConfig: telegramConfig,
    };
  } else if (type === "set_image") {
    return { ...state, image: payload };
  } else {
    throw new Error("Invalid action");
  }
}
