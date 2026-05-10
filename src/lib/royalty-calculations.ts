export type RoyaltyInputs = {
  finishedHours: number;
  royaltySplitPercent: number;
  acxRetailPrice: number;
  estimatedMonthlySales: number;
  buyoutEquivalentRate: number;
};

export function calculateRoyaltyProjection(input: RoyaltyInputs) {
  const narratorSharePerSale =
    input.acxRetailPrice * (input.royaltySplitPercent / 100) * 0.4;
  const monthlyRoyalty = narratorSharePerSale * input.estimatedMonthlySales;
  const buyoutEquivalent = input.finishedHours * input.buyoutEquivalentRate;

  return {
    monthlyRoyalty,
    buyoutEquivalent,
    projected12Months: monthlyRoyalty * 12,
    projected24Months: monthlyRoyalty * 24,
    breakevenMonth:
      monthlyRoyalty > 0 ? Math.ceil(buyoutEquivalent / monthlyRoyalty) : null,
  };
}
