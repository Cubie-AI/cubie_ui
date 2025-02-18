interface LaunchSuccessProps {
  id: number;
  mint: string;
  signature: string;
}
export function LaunchSuccess({ id, mint, signature }: LaunchSuccessProps) {
  return (
    <div>
      <p>Agent launched successfully</p>
      <a href={`/agent/${id}`} target="_blank">
        [agent]
      </a>
      <a href={"https://pump.fun/coin/" + mint} target="_blank">
        [token]
      </a>
      <a href={"https://solscan.io/tx/" + signature} target="_blank">
        [tx]
      </a>
    </div>
  );
}

export function SwapSuccess({
  signature,
}: Pick<LaunchSuccessProps, "signature">) {
  return (
    <div>
      <p>Successfully swapped</p>

      <a href={"https://solscan.io/tx/" + signature} target="_blank">
        [tx]
      </a>
    </div>
  );
}
