/* eslint-disable max-params */
/* eslint-disable no-magic-numbers */
const F = 1; // TODO: Set the value of F

export function calculateHoneyScore(
  gameCount: number,
  maxScore: number,
  nftCount = 0,
  rarityScore = 0,
) {
  return Math.ceil(
    // (1 + Math.max(rarityScore)) * (F + nftCount) *
    (gameCount / 10) * (maxScore / 100),
  );
}
