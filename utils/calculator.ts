import { MenuItem, Solution } from "../types";

/**
 * Solves the variation of the Change Making / Unbounded Knapsack problem.
 * Returns multiple solutions (at least 3 if possible) to give users choices.
 * We minimize k (number of top-ups) and provide variety in solutions.
 * 
 * Optimized for device performance:
 * 1. Uses Integer Arithmetic (Discrete Math) to avoid float errors.
 * 2. Uses a 1D DP array storing multiple paths for reconstruction.
 * 3. Computes reachability once up to the max possible limit.
 */
export const findCheapestCombination = (
  currentBalance: number,
  menuItems: MenuItem[],
  topUpAmount: number = 10,
  maxTopUps: number = 10
): Solution[] => {
  
  // 1. Discretization: Convert everything to cents
  const balanceCents = Math.round(currentBalance * 100);
  const topUpCents = Math.round(topUpAmount * 100);
  
  // Filter invalid items and convert to cents
  const itemsCents = menuItems
    .map((item) => ({ 
        ...item, 
        priceCents: Math.round(item.price * 100)
    }))
    .filter(item => item.priceCents > 0);

  if (itemsCents.length === 0) return [];

  // 2. Determine the search space
  const maxTargetCents = balanceCents + (maxTopUps * topUpCents);
  
  // 3. Initialize DP Table - now storing ALL possible items that can reach each sum
  const dp: number[][] = new Array(maxTargetCents + 1).fill(null).map(() => []);
  dp[0] = [-2]; // Base case: 0 is reachable

  // 4. Run Unbounded Knapsack DP - store all possible transitions
  for (let i = 0; i <= maxTargetCents; i++) {
    if (dp[i].length === 0) continue;

    for (let j = 0; j < itemsCents.length; j++) {
      const itemCost = itemsCents[j].priceCents;
      const nextSum = i + itemCost;

      if (nextSum <= maxTargetCents && !dp[nextSum].includes(j)) {
        dp[nextSum].push(j);
      }
    }
  }

  // 5. Find multiple solutions across different k values
  const solutions: Solution[] = [];
  const solutionSignatures = new Set<string>(); // Track unique solutions

  for (let k = 0; k <= maxTopUps && solutions.length < 5; k++) {
    const targetCents = balanceCents + (k * topUpCents);

    if (dp[targetCents].length > 0) {
      // Find multiple different paths to this target
      const pathsForThisK = findMultiplePaths(
        targetCents, 
        dp, 
        itemsCents, 
        3 - solutions.length, // How many more we need
        k
      );

      for (const solution of pathsForThisK) {
        const signature = createSolutionSignature(solution);
        if (!solutionSignatures.has(signature)) {
          solutionSignatures.add(signature);
          solutions.push(solution);
          if (solutions.length >= 3) break;
        }
      }
    }
  }

  // Sort solutions by preference: fewer top-ups, then fewer items, then more variety
  solutions.sort((a, b) => {
    if (a.topUpsNeeded !== b.topUpsNeeded) return a.topUpsNeeded - b.topUpsNeeded;
    if (a.itemCount !== b.itemCount) return a.itemCount - b.itemCount;
    return b.uniqueItems - a.uniqueItems; // Prefer more variety
  });

  return solutions;
};

/**
 * Creates a unique signature for a solution to avoid duplicates
 */
function createSolutionSignature(solution: Solution): string {
  const itemCounts = new Map<string, number>();
  for (const item of solution.items) {
    itemCounts.set(item.name, (itemCounts.get(item.name) || 0) + 1);
  }
  return Array.from(itemCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => `${name}:${count}`)
    .join('|');
}

/**
 * Find multiple different paths to reach a target sum
 */
function findMultiplePaths(
  targetCents: number,
  dp: number[][],
  itemsCents: any[],
  maxPaths: number,
  topUpsNeeded: number
): Solution[] {
  const solutions: Solution[] = [];
  const visited = new Set<string>();

  // Strategy 1: Greedy - use largest items first
  const path1 = reconstructPath(targetCents, dp, itemsCents, 'largest-first');
  if (path1) {
    const sig = createPathSignature(path1);
    visited.add(sig);
    solutions.push(createSolution(path1, itemsCents, topUpsNeeded, targetCents));
  }

  // Strategy 2: Use smallest items first
  if (solutions.length < maxPaths) {
    const path2 = reconstructPath(targetCents, dp, itemsCents, 'smallest-first');
    if (path2) {
      const sig = createPathSignature(path2);
      if (!visited.has(sig)) {
        visited.add(sig);
        solutions.push(createSolution(path2, itemsCents, topUpsNeeded, targetCents));
      }
    }
  }

  // Strategy 3: Maximize variety (use different items)
  if (solutions.length < maxPaths) {
    const path3 = reconstructPath(targetCents, dp, itemsCents, 'variety');
    if (path3) {
      const sig = createPathSignature(path3);
      if (!visited.has(sig)) {
        visited.add(sig);
        solutions.push(createSolution(path3, itemsCents, topUpsNeeded, targetCents));
      }
    }
  }

  return solutions;
}

/**
 * Reconstruct a path using different strategies
 */
function reconstructPath(
  targetCents: number,
  dp: number[][],
  itemsCents: any[],
  strategy: 'largest-first' | 'smallest-first' | 'variety'
): number[] | null {
  const path: number[] = [];
  let curr = targetCents;
  const usedItems = new Set<number>();

  while (curr > 0) {
    const possibleItems = dp[curr];
    if (!possibleItems || possibleItems.length === 0 || possibleItems[0] === -2) break;

    let chosenItemIndex: number;

    if (strategy === 'largest-first') {
      // Choose the most expensive item
      chosenItemIndex = possibleItems.reduce((maxIdx, idx) => 
        itemsCents[idx].priceCents > itemsCents[maxIdx].priceCents ? idx : maxIdx
      , possibleItems[0]);
    } else if (strategy === 'smallest-first') {
      // Choose the least expensive item
      chosenItemIndex = possibleItems.reduce((minIdx, idx) => 
        itemsCents[idx].priceCents < itemsCents[minIdx].priceCents ? idx : minIdx
      , possibleItems[0]);
    } else { // variety
      // Prefer items we haven't used yet
      const unusedItems = possibleItems.filter(idx => !usedItems.has(idx));
      if (unusedItems.length > 0) {
        chosenItemIndex = unusedItems[0];
      } else {
        chosenItemIndex = possibleItems[0];
      }
      usedItems.add(chosenItemIndex);
    }

    path.push(chosenItemIndex);
    curr -= itemsCents[chosenItemIndex].priceCents;

    // Safety check to prevent infinite loops
    if (path.length > 1000) return null;
  }

  return curr === 0 ? path : null;
}

/**
 * Create a signature for a path (list of item indices)
 */
function createPathSignature(path: number[]): string {
  return path.slice().sort((a, b) => a - b).join(',');
}

/**
 * Create a Solution object from a path
 */
function createSolution(
  path: number[],
  itemsCents: any[],
  topUpsNeeded: number,
  targetCents: number
): Solution {
  const items: MenuItem[] = path.map(idx => ({
    id: itemsCents[idx].id,
    name: itemsCents[idx].name,
    price: itemsCents[idx].price
  }));

  const uniqueItemNames = new Set(items.map(item => item.name));

  return {
    topUpsNeeded,
    finalTargetBalance: targetCents / 100,
    items,
    totalCost: targetCents / 100,
    itemCount: items.length,
    uniqueItems: uniqueItemNames.size
  };
};