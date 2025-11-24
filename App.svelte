<script lang="ts">
  import MenuManager from './components/MenuManager.svelte';
  import SolutionDisplay from './components/SolutionDisplay.svelte';
  import MathExplanation from './components/MathExplanation.svelte';
  import { CalculationStatus } from './types';
  import type { MenuItem, Solution } from './types';
  import { findCheapestCombination } from './utils/calculator';

  // State Management with Runes
  let balanceStr = $state('1.20');
  let topUpIncrementStr = $state('10');
  let menuItems = $state<MenuItem[]>([]);
  let status = $state<CalculationStatus>(CalculationStatus.IDLE);
  let solutions = $state<Solution[]>([]);
  let showMath = $state(false);

  // Persistence - Load Initial
  $effect.root(() => {
    const savedBalance = localStorage.getItem('loyalty_drainer_balance');
    if (savedBalance) balanceStr = savedBalance;

    const savedInc = localStorage.getItem('loyalty_drainer_increment');
    if (savedInc) topUpIncrementStr = savedInc;

    const savedItems = localStorage.getItem('loyalty_drainer_items');
    if (savedItems) {
      try {
        menuItems = JSON.parse(savedItems);
      } catch (e) {
        console.error("Failed to parse saved menu items", e);
      }
    } else {
      // Default Items if empty
      menuItems = [
        { id: '1', name: 'Espresso', price: 3.50 },
        { id: '2', name: 'Latte', price: 4.50 },
        { id: '3', name: 'Cappuccino', price: 4.50 },
        { id: '4', name: 'Muffin', price: 3.80 },
        { id: '5', name: 'Croissant', price: 4.20 },
        { id: '6', name: 'Cookie', price: 2.50 }
      ];
    }
  });

  // Persistence - Save on Change
  $effect(() => {
    localStorage.setItem('loyalty_drainer_balance', balanceStr);
  });
  
  $effect(() => {
    localStorage.setItem('loyalty_drainer_increment', topUpIncrementStr);
  });
  
  $effect(() => {
    localStorage.setItem('loyalty_drainer_items', JSON.stringify(menuItems));
  });

  // Handlers
  function handleCalculate() {
    const currentBalance = parseFloat(balanceStr);
    const increment = parseFloat(topUpIncrementStr);

    if (isNaN(currentBalance) || currentBalance < 0) {
      alert("Please enter a valid balance.");
      return;
    }

    if (isNaN(increment) || increment <= 0) {
      alert("Please enter a valid top-up increment.");
      return;
    }

    if (menuItems.length === 0) {
      alert("Please add some menu items first.");
      return;
    }

    status = CalculationStatus.CALCULATING;
    
    // Tiny delay to allow UI to update
    setTimeout(() => {
      const results = findCheapestCombination(currentBalance, menuItems, increment);
      if (results.length > 0) {
        solutions = results;
        status = CalculationStatus.FOUND;
      } else {
        solutions = [];
        status = CalculationStatus.IMPOSSIBLE;
      }
    }, 100);
  }

  function handleItemsChange(newItems: MenuItem[]) {
    menuItems = newItems;
  }
</script>

<div class="min-h-screen pb-12 bg-gray-50 font-sans">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="bg-emerald-600 p-2 rounded-lg text-white shadow-emerald-200 shadow-md text-2xl">
          🧮
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 leading-none">Loyalty Drainer</h1>
          <p class="text-xs text-gray-500 mt-1">Zero Balance Calculator</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
            onclick={() => showMath = true}
            class="text-sm text-emerald-600 font-medium hover:bg-emerald-50 px-4 py-2.5 min-h-[44px] rounded-full border border-transparent hover:border-emerald-200 transition-all flex items-center gap-2"
        >
            <span class="text-lg">ℹ️</span>
            <span class="hidden sm:inline">How it works</span>
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8 space-y-8">
    
    <!-- Top Section: Balance & Solution -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left: Balance Input & Actions -->
      <div class="lg:col-span-4 flex flex-col gap-6">

        <!-- Balance Input -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            Current Balance
          </h2>
          <div class="flex flex-col gap-2 mb-6">
            <label for="balance" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Enter your current stored value
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-400 pointer-events-none">$</span>
              <input
                id="balance"
                type="number"
                step="0.01"
                bind:value={balanceStr}
                class="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 min-h-[64px] text-3xl font-bold text-gray-900 tracking-tight shadow-inner focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="mb-6 pt-4 border-t border-gray-100">
             <label for="increment" class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Top-up Increment</label>
             <div class="relative">
                 <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-light text-lg">$</span>
                 <input 
                   id="increment"
                   type="number" 
                   bind:value={topUpIncrementStr}
                   class="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 min-h-[44px] pl-8 pr-3 text-gray-700 font-medium text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                   placeholder="10"
                 />
             </div>
          </div>

          <div class="flex flex-col gap-3">
            <button
                onclick={handleCalculate}
                class="w-full bg-gray-900 text-white py-4 min-h-[56px] rounded-xl font-bold text-lg hover:bg-black hover:shadow-xl transform hover:-translate-y-0.5 transition-all active:translate-y-0 flex items-center justify-center gap-2"
            >
                Calculate
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Solution Display -->
      <div class="lg:col-span-8">
        <SolutionDisplay 
            {status} 
            {solutions} 
            currentBalance={parseFloat(balanceStr) || 0}
            topUpIncrement={parseFloat(topUpIncrementStr) || 10}
        />
      </div>
    </section>

    <!-- Bottom Section: Full Width Menu Manager -->
    <section class="w-full">
        <MenuManager items={menuItems} onItemsChange={handleItemsChange} />
    </section>

  </main>

  <MathExplanation bind:open={showMath} />
</div>