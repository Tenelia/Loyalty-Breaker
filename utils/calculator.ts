import { MenuItem, Solution } from "../types";

/**
 * Solves the variation of the Change Making / Unbounded Knapsack problem.
 * We want to find a combination of items that sum EXACTLY to (currentBalance + k * topUpAmount).
 * We minimize k (number of top-ups).
 * 
 * Optimized for device performance:
 * 1. Uses Integer Arithmetic (Discrete Math) to avoid float errors.
 * 2. Uses a 1D DP array storing only parent pointers (reconstruction) instead of full arrays.
 * 3. Computes reachability once up to the max possible limit.
 */
export const findCheapestCombination = (
  currentBalance: number,
  menuItems: MenuItem[],
  topUpAmount: number = 10,
  maxTopUps: number = 10
): Solution | null => {
  
  // 1. Discretization: Convert everything to cents
  const balanceCents = Math.round(currentBalance * 100);
  const topUpCents = Math.round(topUpAmount * 100);
  
  // Filter invalid items and convert to cents
  const itemsCents = menuItems
    .map((item, index) => ({ 
        ...item, 
        priceCents: Math.round(item.price * 100),
        originalIndex: index // Keep track of original index for lookup
    }))
    .filter(item => item.priceCents > 0);

  if (itemsCents.length === 0) return null;

  // 2. Determine the search space
  // We need to check targets: B, B+10, B+20 ... B + (maxTopUps * 10)
  const maxTargetCents = balanceCents + (maxTopUps * topUpCents);
  
  // 3. Initialize DP Table
  // dp[i] stores the index of the item used to reach sum 'i'. 
  // -1 indicates unreachable.
  // We use Int16Array or Int32Array for memory efficiency if list is huge, 
  // but standard array is fine for this scale.
  const dp = new Array(maxTargetCents + 1).fill(-1);
  dp[0] = -2; // Base case: 0 is reachable (marker value)

  // 4. Run Unbounded Knapsack DP (Iterative)
  // We iterate through all possible sums. If a sum 'i' is reachable,
  // then 'i + item_cost' is also reachable.
  for (let i = 0; i <= maxTargetCents; i++) {
    // Optimization: If i is not reachable, we can't build from it.
    if (dp[i] === -1) continue;

    for (let j = 0; j < itemsCents.length; j++) {
      const itemCost = itemsCents[j].priceCents;
      const nextSum = i + itemCost;

      // If next sum is within bounds and not yet found (or found via a longer path? 
      // we don't strictly care about path length for cost, just existence. 
      // First discovery is fine).
      if (nextSum <= maxTargetCents && dp[nextSum] === -1) {
        dp[nextSum] = j; // Store the index of the item that got us here
      }
    }
  }

  // 5. Find the minimal k
  for (let k = 0; k <= maxTopUps; k++) {
    const targetCents = balanceCents + (k * topUpCents);

    if (dp[targetCents] !== -1) {
      // Solution found! Reconstruct the path.
      const resultItems: MenuItem[] = [];
      let curr = targetCents;

      while (curr > 0) {
        const itemIndex = dp[curr];
        if (itemIndex < 0) break; // Should catch -2 base case

        const item = itemsCents[itemIndex];
        // Construct the original MenuItem object
        resultItems.push({
            id: item.id,
            name: item.name,
            price: item.price
        });
        
        curr -= item.priceCents;
      }

      return {
        topUpsNeeded: k,
        finalTargetBalance: targetCents / 100,
        items: resultItems,
        totalCost: targetCents / 100
      };
    }
  }

  return null;
};