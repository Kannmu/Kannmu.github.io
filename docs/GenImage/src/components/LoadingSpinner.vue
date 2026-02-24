<template>
  <div class="flex justify-center items-center">
    <div class="relative w-10 h-10">
      <div v-for="i in 12" :key="i" 
           class="absolute w-[2px] h-[8px] bg-gray-400 rounded-full left-1/2 top-0 origin-[0_20px] opacity-0 animate-spinner"
           :style="{ transform: `rotate(${(i - 1) * 30}deg) translate(0, -10px)`, animationDelay: `${(i - 1) * 0.083}s` }">
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spinner {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
.animate-spinner {
  animation: spinner 1s linear infinite;
}
</style>
