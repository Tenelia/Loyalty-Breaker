<script lang="ts">
  let { open = $bindable(false) } = $props<{ open: boolean }>();
  let dialog: HTMLDialogElement;

  $effect(() => {
    if (open) {
        dialog?.showModal();
    } else {
        dialog?.close();
    }
  });

  function close() {
    open = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog 
    bind:this={dialog} 
    onclose={close}
    onclick={(e) => { if (e.target === dialog) close(); }}
    class="bg-transparent p-0 backdrop:bg-black/50"
>
  <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-auto">
    <header class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        The Math Behind It
      </h2>
      <button 
        onclick={close} 
        class="btn-icon-close text-2xl"
        aria-label="Close modal"
      >
        &times;
      </button>
    </header>
    
    <div class="p-6 space-y-8">
      
      <section>
        <h3 class="font-bold text-lg text-gray-800 mb-3">Problem Definition</h3>
        <p class="text-gray-600 leading-relaxed">
          You have a current balance <code class="bg-gray-100 px-2 py-0.5 rounded text-pink-600 font-mono font-bold">B</code>. 
          You are forced to top up in increments of <code class="bg-gray-100 px-2 py-0.5 rounded text-blue-600 font-mono font-bold">$10</code> (or custom).
          We want to buy a set of items with total cost <code class="bg-gray-100 px-2 py-0.5 rounded text-emerald-600 font-mono font-bold">C</code> such that:
        </p>
        <div class="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-center font-bold text-gray-700">
           C = B + (k × Increment)
        </div>
        <p class="text-sm text-gray-500">
          Where <code class="font-mono">k</code> is an integer (0, 1, 2...) representing the number of top-ups. 
          We want to minimize <code class="font-mono">k</code>.
        </p>
      </section>

      <section>
        <h3 class="font-bold text-lg text-gray-800 mb-3">Dynamic Programming (Knapsack Variation)</h3>
        <p class="text-gray-600 leading-relaxed mb-4">
          This is solved using a variation of the <strong>Unbounded Knapsack Problem</strong> (or Change-Making Problem). 
          Instead of brute-forcing every combination, we build a "reachability table".
        </p>
        
        <div class="space-y-3">
            <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs mt-0.5">A</div>
                <div>
                    <p class="font-medium text-gray-800">Convert to Integers</p>
                    <p class="text-sm text-gray-500">We convert all prices to cents to perform <strong>Discrete Math</strong> operations without floating-point errors.</p>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs mt-0.5">B</div>
                <div>
                    <p class="font-medium text-gray-800">Build the DP Table</p>
                    <p class="text-sm text-gray-500">
                        We create an array <code class="font-mono text-xs bg-gray-100 p-1">dp[]</code> where index <code class="font-mono text-xs">i</code> represents a monetary value.
                        If <code class="font-mono text-xs bg-gray-100 p-1">dp[i]</code> is populated, it means price <code class="font-mono text-xs">i</code> is possible to achieve.
                    </p>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs mt-0.5">C</div>
                <div>
                    <p class="font-medium text-gray-800">Path Reconstruction</p>
                    <p class="text-sm text-gray-500">
                        We store the "last item added" at each step. Once we find a target value (e.g., $11.20) that is reachable, we backtrack through the array to find exactly which items make up that sum.
                    </p>
                </div>
            </div>
        </div>
      </section>

       <section>
        <h3 class="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
            Local Caching
        </h3>
        <p class="text-gray-600 leading-relaxed text-sm">
          To run efficiently on your device, we now verify reachable sums up to the maximum threshold once. We also save your menu to <code class="font-mono bg-gray-100 px-1 rounded">localStorage</code> using Svelte Effects so it persists between reloads!
        </p>
      </section>

    </div>
    <div class="p-6 bg-gray-50 border-t border-gray-100 text-center">
        <button 
          onclick={close} 
          class="btn-primary px-8 py-3"
        >
            Got it, thanks!
        </button>
    </div>
  </div>
</dialog>