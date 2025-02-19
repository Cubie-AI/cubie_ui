import { sendRequest } from "@/lib/utils";
import { WalletSignMessageError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface NonceResponse {
  nonce: string;
}

interface SignResponse {
  token: string;
}

export function useCubieWallet() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt") || null
  );

  const isSigning = useRef(false);
  const getNonce = useCallback(async () => {
    if (!wallet || !wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    const { error, data } = await sendRequest<NonceResponse>(
      `/api/auth/nonce?address=${wallet.publicKey.toBase58()}`
    );
    if (!data?.nonce) {
      toast.error(error || "Unable to fetch nonce for signing.");
      return;
    }
    console.log("nonceData", data);
    return data.nonce;
  }, [wallet]);

  const signIn = useCallback(async () => {
    if (!wallet || !wallet.signMessage || !wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    const nonce = await getNonce();
    if (!nonce) {
      return;
    }
    try {
      const signedMessage = await wallet.signMessage(
        new TextEncoder().encode(nonce)
      );
      const signature = bs58.encode(signedMessage);

      const { error, data } = await sendRequest<SignResponse>(
        "/api/auth/sign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature,
            address: wallet.publicKey.toBase58(),
            nonce: nonce,
          }),
        }
      );

      if (error || !data) {
        isSigning;
        toast.error(error || "Failed to sign in");
        wallet.disconnect();
        return;
      }

      setToken(data.token);
      localStorage.setItem("jwt", data.token);
      toast.success("Signed in successfully");
    } catch (error) {
      if (error instanceof WalletSignMessageError) {
        toast.error("User rejected the message");
        wallet.disconnect();
      }
    }

    isSigning.current = false;
  }, [wallet]);

  const disconnect = async () => {
    setToken(null);
    localStorage.removeItem("jwt");
  };

  useEffect(() => {
    if (wallet.connected && !isSigning.current && !token) {
      isSigning.current = true;
      signIn();
    } else if (wallet.disconnecting || !wallet.connected) {
      disconnect();
    }
  }, [wallet, token]);

  const value = useMemo(
    () => ({
      wallet,
      token,
      connection,
    }),
    [wallet, token, connection]
  );

  return value;
}
