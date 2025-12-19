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
        <div>
          <h1 class="text-xl font-bold text-gray-900 leading-none">Loyalty Breaker</h1>
          <p class="text-xs text-gray-500 mt-1">Zero Balance Calculator</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
            onclick={() => showMath = true}
            class="btn-secondary"
        >
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
          <div class="flex flex-col gap-2 mb-6">
            <label for="balance" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Enter your current stored value
            </label>
            <div class="relative">
              <span class="currency-prefix currency-prefix-large">$</span>
              <input
                id="balance"
                type="number"
                step="0.01"
                bind:value={balanceStr}
                class="input-currency input-currency-large"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="mb-6 pt-4 border-t border-gray-100">
             <label for="increment" class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Top-up Increment</label>
             <div class="relative">
                 <span class="currency-prefix currency-prefix-medium">$</span>
                 <input 
                   id="increment"
                   type="number" 
                   bind:value={topUpIncrementStr}
                   class="input-currency input-currency-medium"
                   placeholder="10"
                 />
             </div>
          </div>

          <div class="flex flex-col gap-3">
            <button
                onclick={handleCalculate}
                class="btn-large w-full"
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