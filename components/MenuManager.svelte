<script lang="ts">
  import { Plus, X, Coffee, BookOpen } from 'lucide-svelte';
  import type { MenuItem } from '../types';

  let { items, onItemsChange } = $props<{ 
    items: MenuItem[], 
    onItemsChange: (items: MenuItem[]) => void 
  }>();

  let newItemName = $state('');
  let newItemPrice = $state('');

  // Comprehensive Starbucks Singapore Preset (re-declared for Svelte context)
  const STARBUCKS_SG_PRESET = [
    { name: 'Caffè Americano (Tall)', price: 5.60 },
    { name: 'Caffè Americano (Grande)', price: 6.20 },
    { name: 'Caffè Americano (Venti)', price: 6.70 },
    { name: 'Caffè Latte (Tall)', price: 7.10 },
    { name: 'Caffè Latte (Grande)', price: 7.70 },
    { name: 'Caffè Latte (Venti)', price: 8.20 },
    { name: 'Cappuccino (Tall)', price: 7.10 },
    { name: 'Cappuccino (Grande)', price: 7.70 },
    { name: 'Cappuccino (Venti)', price: 8.20 },
    { name: 'Caramel Macchiato (Tall)', price: 7.80 },
    { name: 'Caramel Macchiato (Grande)', price: 8.40 },
    { name: 'Caramel Macchiato (Venti)', price: 8.90 },
    { name: 'White Choc Mocha (Tall)', price: 7.60 },
    { name: 'White Choc Mocha (Grande)', price: 8.20 },
    { name: 'White Choc Mocha (Venti)', price: 8.70 },
    { name: 'Caffè Mocha (Tall)', price: 7.30 },
    { name: 'Caffè Mocha (Grande)', price: 7.90 },
    { name: 'Flat White (Tall)', price: 7.10 },
    { name: 'Flat White (Grande)', price: 7.70 },
    { name: 'Espresso (Doppio)', price: 4.60 },
    { name: 'Cold Brew (Tall)', price: 6.30 },
    { name: 'Cold Brew (Grande)', price: 6.90 },
    { name: 'Cold Brew (Venti)', price: 7.40 },
    { name: 'Vanilla Sweet Cream Cold Brew (Tall)', price: 7.50 },
    { name: 'Vanilla Sweet Cream Cold Brew (Grande)', price: 8.10 },
    { name: 'Caramel Frappuccino (Tall)', price: 7.80 },
    { name: 'Caramel Frappuccino (Grande)', price: 8.40 },
    { name: 'Caramel Frappuccino (Venti)', price: 8.90 },
    { name: 'Java Chip Frappuccino (Tall)', price: 8.20 },
    { name: 'Java Chip Frappuccino (Grande)', price: 8.80 },
    { name: 'Java Chip Frappuccino (Venti)', price: 9.30 },
    { name: 'Dark Mocha Frappuccino (Tall)', price: 8.20 },
    { name: 'Dark Mocha Frappuccino (Grande)', price: 8.80 },
    { name: 'Green Tea Frappuccino (Tall)', price: 8.20 },
    { name: 'Green Tea Frappuccino (Grande)', price: 8.80 },
    { name: 'Mango Passion Fruit Frappuccino (Tall)', price: 7.80 },
    { name: 'Mango Passion Fruit Frappuccino (Grande)', price: 8.40 },
    { name: 'Chocolate Chip Cream Frappuccino (Tall)', price: 8.20 },
    { name: 'Green Tea Latte (Tall)', price: 7.30 },
    { name: 'Green Tea Latte (Grande)', price: 7.90 },
    { name: 'Chai Tea Latte (Tall)', price: 7.10 },
    { name: 'Chai Tea Latte (Grande)', price: 7.70 },
    { name: 'Iced Shaken Hibiscus Tea (Tall)', price: 5.80 },
    { name: 'Iced Shaken Hibiscus Tea (Grande)', price: 6.40 },
    { name: 'English Breakfast Tea', price: 4.90 },
    { name: 'Earl Grey Tea', price: 4.90 },
    { name: 'Emperor Clouds & Mist Green Tea', price: 4.90 },
    { name: 'New York Cheesecake', price: 7.90 },
    { name: 'Chocolate of a Thousand Leaves', price: 7.90 },
    { name: 'Classic Dark Chocolate Cake', price: 7.50 },
    { name: 'Blueberry Muffin', price: 4.50 },
    { name: 'Chocolate Chip Muffin', price: 4.50 },
    { name: 'Banana Walnut Muffin', price: 4.50 },
    { name: 'Butter Croissant', price: 3.90 },
    { name: 'Almond Croissant', price: 4.50 },
    { name: 'Ham & Cheese Croissant', price: 6.20 },
    { name: 'Chocolate Chip Cookie', price: 4.50 },
    { name: 'Oatmeal Raisin Cookie', price: 4.50 },
    { name: 'Egg White, Roasted Pepper & Cheddar Wrap', price: 6.90 },
    { name: 'Chicken Ham & Cheese Panini', price: 7.50 },
    { name: 'Roast Chicken & Sriracha Mayo Panini', price: 7.90 },
    { name: 'Mushroom & Cheese Pie', price: 6.50 },
    { name: 'Chicken & Mushroom Pie', price: 6.90 },
    { name: 'Shepherd\'s Pie', price: 7.20 }
  ];

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  function handleManualAdd(e: Event) {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    
    const price = parseFloat(newItemPrice);
    if (isNaN(price)) return;

    onItemsChange([...items, { id: generateId(), name: newItemName, price }]);
    newItemName = '';
    newItemPrice = '';
  }

  function handleRemoveItem(id: string) {
    onItemsChange(items.filter(item => item.id !== id));
  }

  function handleLoadPreset() {
    const presetItems = STARBUCKS_SG_PRESET.map(item => ({
        id: generateId(), 
        name: item.name,
        price: item.price
    }));

    if (items.length > 0) {
        if (window.confirm("This will replace your current menu list with the Starbucks SG Menu. Continue?")) {
            onItemsChange(presetItems);
        }
    } else {
        onItemsChange(presetItems);
    }
  }
</script>

<article class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
        <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen size={20} class="text-emerald-600"/>
            Menu Items
        </h2>
        <p class="text-xs text-gray-500 mt-1">
            {items.length} items available 
        </p>
    </div>
    
    <div class="flex flex-wrap gap-2 w-full md:w-auto">
        <button
            onclick={handleLoadPreset}
            class="flex-1 md:flex-none justify-center px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold border border-emerald-200"
            title="Load Starbucks SG Menu"
        >
            <Coffee size={16} />
            <span>Load SG Menu</span>
        </button>
    </div>
  </div>

  <!-- Manual Entry Form -->
  <form onsubmit={handleManualAdd} class="flex gap-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
    <input
      type="text"
      placeholder="Add new item name..."
      bind:value={newItemName}
      class="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
    />
    <input
      type="number"
      placeholder="$"
      step="0.01"
      bind:value={newItemPrice}
      class="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
    />
    <button
      type="submit"
      disabled={!newItemName || !newItemPrice}
      class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <Plus size={20} />
    </button>
  </form>

  <!-- List - Responsive Grid Layout -->
  <div class="border border-gray-100 rounded-xl bg-gray-50/50 p-4">
    {#if items.length === 0}
        <div class="flex flex-col items-center justify-center text-gray-400 p-12 text-center min-h-[300px]">
            <Coffee size={48} class="mb-4 opacity-20" />
            <p class="text-sm font-medium">Your menu is empty.</p>
            <p class="text-xs mt-1">Add items manually or load the Starbucks preset above.</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {#each items as item (item.id)}
            <div
                class="flex flex-col justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group relative"
            >
                <div class="flex justify-between items-start gap-2 mb-1">
                    <span class="text-gray-700 font-medium text-sm leading-tight">{item.name}</span>
                    <button
                        onclick={() => handleRemoveItem(item.id)}
                        class="text-gray-300 hover:text-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
                        title="Remove item"
                    >
                        <X size={14} />
                    </button>
                </div>
                <div class="flex items-center justify-between mt-2">
                        <span class="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold border border-emerald-100">
                        ${item.price.toFixed(2)}
                    </span>
                </div>
            </div>
            {/each}
        </div>
    {/if}
  </div>
</article>