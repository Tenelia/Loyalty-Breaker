<script lang="ts">
  import { ShoppingCart, CheckCircle, AlertCircle, Coffee } from 'lucide-svelte';
  import { CalculationStatus, type Solution } from '../types';

  let { status, solution, currentBalance, topUpIncrement } = $props<{
    status: CalculationStatus,
    solution: Solution | null,
    currentBalance: number,
    topUpIncrement: number
  }>();

  let totalTopUp = $derived(solution ? solution.topUpsNeeded * topUpIncrement : 0);
  let itemsCount = $derived.by(() => {
      if (!solution) return {};
      return solution.items.reduce((acc: any, item) => {
          acc[item.name] = (acc[item.name] || 0) + 1;
          return acc;
      }, {});
  });
</script>

{#if status === CalculationStatus.IDLE}
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
    <div class="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Coffee class="text-blue-500" size={32} />
    </div>
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Ready to Calculate</h3>
    <p class="text-gray-500 text-sm">
        Add your menu items and set your current balance to find the perfect order.
    </p>
    </div>
{:else if status === CalculationStatus.CALCULATING}
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center animate-pulse">
    <div class="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
    <div class="h-6 w-32 bg-gray-200 rounded mx-auto mb-2"></div>
    <div class="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
    </div>
{:else if status === CalculationStatus.IMPOSSIBLE}
    <div class="bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center">
    <div class="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="text-red-500" size={32} />
    </div>
    <h3 class="text-lg font-semibold text-red-800 mb-2">No Combination Found</h3>
    <p class="text-gray-500 text-sm">
        We couldn't find a combination within a reasonable number of top-ups (max 10). Try adding more low-cost items.
    </p>
    </div>
{:else if status === CalculationStatus.FOUND && solution}
    <article class="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden relative">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
    
    <header class="p-6 bg-emerald-50/50 border-b border-emerald-100">
        <div class="flex items-start justify-between">
        <div>
            <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle class="text-emerald-500" />
            Solution Found!
            </h2>
            <p class="text-gray-600 mt-1">
            Drain your card to exactly <span class="font-bold text-gray-900">$0.00</span>
            </p>
        </div>
        <div class="text-right">
            <div class="text-sm text-gray-500 uppercase tracking-wide font-semibold">Total Order</div>
            <div class="text-3xl font-bold text-emerald-600">${solution.totalCost.toFixed(2)}</div>
        </div>
        </div>
    </header>

    <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Strategy Card -->
        <section class="md:col-span-1 space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div class="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Current Balance</div>
                <div class="text-xl font-bold text-gray-800">${currentBalance.toFixed(2)}</div>
            </div>
            <div class="flex justify-center items-center">
                <span class="text-gray-400 text-2xl">+</span>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div class="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Top-ups Needed</div>
                <div class="text-xl font-bold text-gray-800">{solution.topUpsNeeded} <span class="text-sm font-normal text-gray-500">x ${topUpIncrement.toFixed(2)}</span></div>
                <div class="text-sm text-gray-500 mt-1">= ${totalTopUp.toFixed(2)} added</div>
            </div>
        </section>

        <!-- Receipt Card -->
        <section class="md:col-span-2 bg-gray-50 rounded-lg p-5 border border-gray-200 flex flex-col">
            <div class="flex items-center gap-2 mb-4 text-gray-500 border-b border-gray-200 pb-2">
                <ShoppingCart size={18} />
                <span class="font-medium text-sm">Order Summary</span>
            </div>
            <div class="flex-1 overflow-auto">
                <table class="w-full text-sm text-left">
                    <tbody>
                        {#each Object.entries(itemsCount) as [name, count] (name)}
                            {@const itemPrice = solution.items.find(i => i.name === name)?.price || 0}
                            <tr class="border-b border-gray-100 last:border-0">
                                <td class="py-2 w-12">
                                    <div class="bg-white border border-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs font-bold text-gray-600">
                                        {count}x
                                    </div>
                                </td>
                                <td class="py-2 text-gray-800">{name}</td>
                                <td class="py-2 text-right text-gray-600 font-mono">${(itemPrice * (count as number)).toFixed(2)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <div class="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center">
                <span class="font-bold text-gray-700">Total</span>
                <span class="font-bold text-gray-900 font-mono">${solution.totalCost.toFixed(2)}</span>
            </div>
        </section>
    </div>
    </article>
{/if}