/* eslint-disable max-params */
/* eslint-disable no-magic-numbers */
export function calculateScore(
  gameCount: number,
  maxScore: number,
  nftCount = 1,
  rarityScore = 1,
) {
  return Math.ceil(
    (1 + Math.max(rarityScore)) *
      nftCount *
      (gameCount / 10) *
      (maxScore / 100),
  );
}
