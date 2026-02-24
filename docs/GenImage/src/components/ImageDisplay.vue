<script setup lang="ts">
import { Download, Copy, Check } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  imageUrl: string
}>()

const copied = ref(false)

const downloadImage = () => {
  const link = document.createElement('a')
  link.href = props.imageUrl
  link.download = `zenmux-generated-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const copyImage = async () => {
  try {
    const response = await fetch(props.imageUrl)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
    // Fallback for non-secure contexts or if ClipboardItem fails
    alert('Copy failed. Please right-click the image to copy.')
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
    <div class="relative rounded-2xl overflow-hidden shadow-2xl group bg-white">
      <img :src="imageUrl" alt="Generated Image" class="w-full h-auto object-cover" />
      
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3">
        <button 
          @click="copyImage"
          class="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors tooltip"
          :title="copied ? 'Copied!' : 'Copy Image'"
        >
          <component :is="copied ? Check : Copy" class="w-5 h-5" />
        </button>
        <button 
          @click="downloadImage"
          class="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors tooltip"
          title="Download Image"
        >
          <Download class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
