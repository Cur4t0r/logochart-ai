<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { animate } from 'motion';
import type { LogoMetadata } from '../services/gemini';

const props = defineProps<{
  logo: LogoMetadata | null;
  loading: boolean;
}>();

const loaderRef = ref<HTMLElement | null>(null);
const logoRef = ref<HTMLElement | null>(null);

let loaderAnimation: any = null;
let logoAnimation: any = null;

watch(() => props.loading, async (newVal) => {
  if (newVal) {
    await nextTick();
    if (loaderRef.value) {
      if (!loaderAnimation) {
         loaderAnimation = animate(loaderRef.value, { rotate: 360 }, { duration: 1, repeat: Infinity, ease: "linear" });
      }
    }
  } else {
    if (loaderAnimation) {
      loaderAnimation.stop();
      loaderAnimation = null;
    }
  }
}, { immediate: true });

watch(() => props.logo, async (newVal) => {
  if (newVal) {
    await nextTick();
    if (logoRef.value) {
      if (logoAnimation) logoAnimation.stop();
      
      const type = newVal.animation.type;
      let keyframes: any = {};
      if (type === "spin") keyframes = { rotate: [0, 360] };
      else if (type === "pulse") keyframes = { scale: [1, 1.05, 1] };
      else if (type === "float") keyframes = { y: [0, -10, 0] };
      else keyframes = { opacity: [0, 1] };

      logoAnimation = animate(logoRef.value, keyframes, {
        duration: newVal.animation.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: newVal.animation.delay
      });
    }
  }
}, { immediate: true });
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center p-12 border border-black/10 rounded-xl bg-white/50 backdrop-blur-sm h-[400px]">
    <div ref="loaderRef">
      <Loader2 class="w-12 h-12 text-black/40" />
    </div>
    <p class="mt-4 text-sm font-mono uppercase tracking-widest text-black/40">Synthesizing Brand Identity...</p>
  </div>

  <div v-else-if="!logo" class="flex flex-col items-center justify-center p-12 border border-dashed border-black/20 rounded-xl bg-black/[0.02] h-[400px]">
    <p class="text-sm font-mono uppercase tracking-widest text-black/30">Logo Preview Area</p>
  </div>

  <div v-else class="flex flex-col space-y-6">
    <div class="relative group p-12 border border-black/10 rounded-xl bg-white shadow-2xl shadow-black/5 overflow-hidden flex items-center justify-center h-[400px]">
      <!-- Visual Grid Background -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px"></div>
      
      <div ref="logoRef" v-html="logo.svg" class="w-48 h-48 drop-shadow-xl"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 border border-black/10 rounded-lg bg-black/[0.02]">
        <h4 class="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-3">Design Rationale</h4>
        <p class="text-sm text-black/70 leading-relaxed font-sans italic">"{{ logo.rationale }}"</p>
      </div>
      <div class="p-4 border border-black/10 rounded-lg bg-black/[0.02]">
        <h4 class="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-3">Palette Analysis</h4>
        <div class="flex gap-2">
          <div v-for="(color, i) in logo.brandColors" :key="i" class="flex flex-col items-center gap-1">
            <div class="w-8 h-8 rounded-full border border-black/5" :style="{ backgroundColor: color }"></div>
            <span class="text-[9px] font-mono text-black/40 uppercase">{{ color }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
