interface LaunchSuccessProps {
  mint: string;
  signature: string;
}
export function LaunchSuccess({ mint, signature }: LaunchSuccessProps) {
  return (
    <div>
      <p>Agent launched successfully</p>
      <a href={"https://pump.fun/coin/" + mint} target="_blank">
        [token]
      </a>
      <a href={"https://solscan.io/tx/" + signature} target="_blank">
        [tx]
      </a>
    </div>
  );
}
