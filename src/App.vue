<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles, ArrowRight, Palette, Building2 } from 'lucide-vue-next';
import LogoDisplay from './components/LogoDisplay.vue';
import { generateLogo, type LogoMetadata } from './services/gemini';

const loading = ref(false);
const logo = ref<LogoMetadata | null>(null);
const formData = ref({
  name: '',
  industry: '',
  colors: ''
});

const handleSubmit = async () => {
  if (!formData.value.name) return;

  loading.value = true;
  try {
    const colorArr = formData.value.colors.split(',').map(c => c.trim()).filter(Boolean);
    const result = await generateLogo(formData.value.name, formData.value.industry, colorArr);
    logo.value = result;
    
    // Persist to backend
    await fetch('/api/logos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.value.name, logoData: result })
    });
  } catch (error: any) {
    console.error('Generation failed:', error);
    alert(error.message || 'An error occurred during generation. Make sure GEMINI_API_KEY is set in secrets.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F0F0EE] text-[#141414] selection:bg-[#141414] selection:text-[#F0F0EE]">
    <!-- Header Grid Rail -->
    <div class="border-b border-black/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-[#141414] rounded-sm flex items-center justify-center">
            <Sparkles class="w-4 h-4 text-[#F0F0EE]" />
          </div>
          <span class="text-sm font-mono font-bold uppercase tracking-tighter">LogoCraft AI / v1.0</span>
        </div>
        <div class="flex items-center gap-6">
          <span class="text-[10px] font-mono text-black/40 uppercase tracking-widest hidden md:block">Process: Neural Synthesis</span>
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </div>

    <main class="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
      <!-- Left Side: Preview -->
      <div class="order-2 lg:order-1">
        <LogoDisplay :logo="logo" :loading="loading" />
      </div>

      <!-- Right Side: Configuration -->
      <div class="order-1 lg:order-2 space-y-8">
        <div class="space-y-4">
          <h1 class="text-4xl font-sans font-medium tracking-tight leading-[0.9]">
            Define your <br />
            <span class="italic font-serif">Visual Identity.</span>
          </h1>
          <p class="text-sm text-black/60 leading-relaxed font-sans max-w-sm">
            Our neural engine analyzes your brand essence to compute precise geometric symbols and cinematic motion paths.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-mono uppercase tracking-widest text-black/40 flex items-center gap-2">
                 <Building2 class="w-3 h-3" /> Company Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Lumina Tech"
                class="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono placeholder:text-black/20"
                v-model="formData.name"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-mono uppercase tracking-widest text-black/40 flex items-center gap-2">
                 <ArrowRight class="w-3 h-3" /> Industry
              </label>
              <input
                type="text"
                placeholder="e.g. Sustainable Energy"
                class="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono placeholder:text-black/20"
                v-model="formData.industry"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-mono uppercase tracking-widest text-black/40 flex items-center gap-2">
                 <Palette class="w-3 h-3" /> Preferred Colors
              </label>
              <input
                type="text"
                placeholder="e.g. Midnight Blue, Silver"
                class="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono placeholder:text-black/20"
                v-model="formData.colors"
              />
            </div>
          </div>

          <button
            :disabled="loading"
            class="group w-full bg-[#141414] text-[#F0F0EE] py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:gap-5 hover:bg-black/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="text-sm font-mono uppercase tracking-widest">Construct Logo</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </form>

        <!-- System Metadata Rail -->
        <div class="pt-8 border-t border-black/10 flex flex-col gap-4">
           <div class="flex justify-between text-[9px] font-mono uppercase tracking-tighter text-black/40">
              <span>Model: Gemini 3 Flash</span>
              <span>Mode: Vector Synthesis</span>
           </div>
           <div class="flex justify-between text-[9px] font-mono uppercase tracking-tighter text-black/40">
              <span>Latency: ~2.4s</span>
              <span>Status: Optimized</span>
           </div>
        </div>
      </div>
    </main>

    <!-- Background Decorative Element -->
    <div class="fixed bottom-0 left-0 p-8 opacity-10 font-mono text-[120px] font-bold tracking-tighter pointer-events-none select-none">
      LC / 26
    </div>
  </div>
</template>
