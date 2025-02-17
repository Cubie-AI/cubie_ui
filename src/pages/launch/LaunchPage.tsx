import { LaunchInputList } from "@/components/launch/LaunchInputList";
import { LaunchSuccess } from "@/components/toasts/LaunchSuccess";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import { useCubieWallet } from "@/hooks/wallet-hook";
import { cn, sendRequest } from "@/lib/utils";
import { SendTransactionError, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { ArrowLeft, Rocket } from "lucide-react";
import { useReducer } from "react";
import { toast } from "sonner";
import { agentReducer } from "./reducer";
import { AgentSettings, LaunchResponse } from "./types";
import { buildAgentFormData } from "./util";

const DEFAULT_AGENT_STATE: AgentSettings = {
  name: "",
  ticker: "",
  bio: "",
  knowledge: [],
  enabledPlatforms: [],
  twitterConfig: {
    username: "",
    email: "",
    password: "",
  },
  telegramConfig: {
    bot_secret: "",
    username: "",
  },
  twitterStyles: [],
  telegramStyles: [],
  style: [],
  buyAmount: "0.15",
  image: undefined,
};

const getProvider = () => {
  if ("phantom" in window) {
    // @ts-ignore
    const provider = window.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  window.open("https://phantom.app/", "_blank");
};

function LaunchPage() {
  const { wallet, token, connection } = useCubieWallet();
  const [agentState, dispatch] = useReducer(agentReducer, DEFAULT_AGENT_STATE);

  const submitAgent = async () => {
    console.log("Submit Agent");
    if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
      toast.error("Wallet not connected");
      return;
    }
    const formData = buildAgentFormData(agentState);
    if (!formData) {
      return;
    }
    const { error, data } = await sendRequest<LaunchResponse>(
      "/api/agent/launch",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (error || !data) {
      toast.error(error || "Failed to launch agent");
      return;
    }

    const decode = Buffer.from(data.transaction, "base64");
    const transaction = VersionedTransaction.deserialize(decode);

    try {
      const provider = getProvider();
      let signature: string;
      if (provider) {
        console.log("Signing transaction using window provider");
        const signAndSend = await provider.signAndSendTransaction(transaction);
        signature = signAndSend.signature;
      } else {
        console.log("Signing transaction using wallet");
        const signedTransaction = await wallet.signTransaction(transaction);
        signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            maxRetries: 5,
          }
        );
      }

      toast.success(() => (
        <LaunchSuccess mint={data.mint} signature={signature} />
      ));
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed");
      if (error instanceof SendTransactionError) {
        console.log(await error.getLogs(connection));
      }
    }
  };

  const handleImageSelect = (file: File) => {
    dispatch({ type: "set_image", payload: file });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 md:top-8 md:left-8"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-3xl font-bold text-center">Launch Agent</h1>

        <div className="space-y-8">
          {/* Single Card for All Inputs */}
          <Card className="p-6 border">
            <CardHeader>
              <CardTitle>Launch Agent</CardTitle>
              <CardDescription>
                Configure your agent's settings and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Image and Basic Info Section */}
              <div className="flex flex-col md:flex-row gap-8 h-[300px]">
                {/* Left Column - Image Upload */}
                <div className="w-full md:w-64">
                  <div className="h-full flex flex-col">
                    <Label className="mb-3">Agent Image</Label>
                    <div className="flex-1 border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <UploadDropzone
                        onFileSelect={handleImageSelect}
                        currentImage={
                          agentState.image
                            ? URL.createObjectURL(agentState.image)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Basic Info */}
                <div className="flex-1">
                  <div className="h-full flex flex-col">
                    <div className="space-y-3 mb-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={agentState.name}
                            onChange={(e) =>
                              dispatch({
                                type: "set_field",
                                payload: {
                                  name: "name",
                                  value: e.target.value,
                                },
                              })
                            }
                            placeholder="CubieCubed"
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor="ticker">Ticker</Label>
                          <Input
                            id="ticker"
                            value={agentState.ticker}
                            onChange={(e) =>
                              dispatch({
                                type: "set_field",
                                payload: {
                                  name: "ticker",
                                  value: e.target.value,
                                },
                              })
                            }
                            placeholder="CUBIE"
                            className="font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col space-y-3">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={agentState.bio}
                        onChange={(e) =>
                          dispatch({
                            type: "set_field",
                            payload: {
                              name: "bio",
                              value: e.target.value,
                            },
                          })
                        }
                        placeholder="First social agent built using $MAIAR"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8" />

              {/* Knowledge Section */}
              <LaunchInputList
                label="Knowledge"
                name="knowledge"
                values={agentState.knowledge}
                dispatch={dispatch}
                placeholder="Enter knowledge or information the agent should know..."
              />

              <div className="border-t pt-8" />

              {/* Global Style Rules */}
              <LaunchInputList
                label="Style Rules"
                name="style"
                values={agentState.style}
                dispatch={dispatch}
                placeholder="Enter style rules that apply to all platforms..."
              />

              <div className="border-t pt-8" />

              {/* Platform Selection */}
              <ToggleGroup
                type="multiple"
                variant="outline"
                value={agentState.enabledPlatforms}
                onValueChange={(value) =>
                  dispatch({
                    type: "set_field",
                    payload: {
                      name: "enabledPlatforms",
                      value: value,
                    },
                  })
                }
                className="grid grid-cols-2 w-full"
              >
                <ToggleGroupItem value="twitter" className="">
                  Twitter
                </ToggleGroupItem>
                <ToggleGroupItem value="telegram" className="">
                  Telegram
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Platform Specific Sections */}
              <div className="grid grid-cols-2 gap-8">
                {/* Twitter Column */}
                <div>
                  {agentState.enabledPlatforms.includes("twitter") && (
                    <div className="space-y-4">
                      <Label>Twitter Configuration</Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="Username"
                          value={agentState.twitterConfig.username}
                          onChange={(e) =>
                            dispatch({
                              type: "set_twitter_config",
                              payload: {
                                name: "username",
                                value: e.target.value,
                              },
                            })
                          }
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={agentState.twitterConfig.email}
                          onChange={(e) =>
                            dispatch({
                              type: "set_twitter_config",
                              payload: {
                                name: "email",
                                value: e.target.value,
                              },
                            })
                          }
                        />
                        <Input
                          placeholder="Password"
                          type="password"
                          value={agentState.twitterConfig.password}
                          onChange={(e) => {
                            dispatch({
                              type: "set_twitter_config",
                              payload: {
                                name: "password",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Telegram Column */}
                <div>
                  {agentState.enabledPlatforms.includes("telegram") && (
                    <div className="space-y-4">
                      <Label>Telegram Configuration</Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="Username"
                          value={agentState.telegramConfig.username}
                          onChange={(e) =>
                            dispatch({
                              type: "set_telegram_config",
                              payload: {
                                name: "username",
                                value: e.target.value,
                              },
                            })
                          }
                        />
                        <Input
                          placeholder="Bot Secret"
                          value={agentState.telegramConfig.bot_secret}
                          onChange={(e) =>
                            dispatch({
                              type: "set_telegram_config",
                              payload: {
                                name: "bot_secret",
                                value: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Twitter Styles */}
                <div>
                  {agentState.enabledPlatforms.includes("twitter") && (
                    <LaunchInputList
                      label="Twitter Style Rules"
                      name="twitterStyles"
                      values={agentState.twitterStyles}
                      dispatch={dispatch}
                      placeholder="Enter Twitter-specific style rules..."
                    />
                  )}
                </div>

                {/* Telegram Styles */}
                <div>
                  {agentState.enabledPlatforms.includes("telegram") && (
                    <LaunchInputList
                      label="Telegram Style Rules"
                      name="telegramStyles"
                      values={agentState.telegramStyles}
                      dispatch={dispatch}
                      placeholder="Enter Telegram-specific style rules..."
                    />
                  )}
                </div>
              </div>

              <div className="border-t pt-8" />

              {/* Buy Amount Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Buy Amount</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the amount of SOL you want to spend
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyAmount">Buy</Label>
                  <Input
                    id="buyAmount"
                    value={agentState.buyAmount}
                    onChange={(e) =>
                      dispatch({
                        type: "set_field",
                        payload: {
                          name: "buyAmount",
                          value: e.target.value,
                        },
                      })
                    }
                    placeholder="0.15"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Launch Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className={cn(
                "bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-semibold",
                "px-8 py-6 text-lg shadow-lg",
                "flex items-center gap-2"
              )}
              onClick={submitAgent}
            >
              <Rocket className="h-5 w-5" />
              Launch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaunchPage;
