<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import ApiKeyInput from './components/ApiKeyInput.vue'
import ImageGenerator from './components/ImageGenerator.vue'
import ImageDisplay from './components/ImageDisplay.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { AlertCircle, DollarSign } from 'lucide-vue-next'

const apiKey = useStorage('zenmux-api-key', '')
const loading = ref(false)
const generatedImage = ref<string | null>(null)
const error = ref<string | null>(null)
const totalCost = ref(0)

const models: Record<string, { input: number, output: number }> = {
  'google/gemini-3.1-flash-image-preview': { input: 0.25, output: 1.5 },
  'google/gemini-3-pro-image-preview': { input: 2.0, output: 12.0 }
}

const handleGenerate = async ({ prompt, image, aspectRatio, imageSize, model }: { prompt: string, image: string | null, aspectRatio: string, imageSize: string, model: string }) => {
  loading.value = true
  error.value = null
  generatedImage.value = null

  try {
    const parts: any[] = [{ text: prompt }]

    if (image) {
      // Remove data:image/xxx;base64, prefix
      const base64Data = image.split(',')[1]
      const mimeType = image.split(';')[0]?.split(':')[1] || 'image/jpeg'
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      })
    }

    const response = await axios.post(
      `https://zenmux.ai/api/vertex-ai/v1/models/${model}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts: parts
          }
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize,
            imageOutputOptions: {
              mimeType: "image/jpeg",
              compressionQuality: 75
            }
          }
        }
      },
      {
        headers: {
          'x-goog-api-key': apiKey.value,
          'Content-Type': 'application/json'
        }
      }
    )

    // Calculate cost
    let inputTokens = 0
    let outputTokens = 0
    
    // Try to get usage metadata
    if (response.data.usageMetadata) {
      inputTokens = response.data.usageMetadata.promptTokenCount || 0
      outputTokens = response.data.usageMetadata.candidatesTokenCount || 0
    } else {
      // Estimation fallback
      inputTokens = Math.ceil(prompt.length / 4)
      
      // Rough estimation for output tokens if metadata is missing
      // Assuming ~25k tokens for 1K, scaling by area
      const baseTokens = 25000 
      if (imageSize === '2K') outputTokens = baseTokens * 4
      else if (imageSize === '4K') outputTokens = baseTokens * 16
      else outputTokens = baseTokens
    }

    const modelPricing = models[model]
    if (modelPricing) {
      const cost = (inputTokens / 1_000_000 * modelPricing.input) + (outputTokens / 1_000_000 * modelPricing.output)
      totalCost.value += cost
    }

    // Parse response
    const candidates = response.data.candidates
    if (!candidates || candidates.length === 0) {
      throw new Error('No candidates in response')
    }

    const candidate = candidates[0]
    
    // Check for safety ratings or finish reason
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      // If there's content, we might still want to check it for a text explanation
      if (!candidate.content || !candidate.content.parts) {
         throw new Error(`Generation stopped: ${candidate.finishReason}`)
      }
    }

    if (!candidate.content || !candidate.content.parts) {
       throw new Error('Response content is empty')
    }

    const responseParts = candidate.content.parts
    const imagePart = responseParts.find((p: any) => p.inlineData || p.inline_data)
    
    if (imagePart) {
      const imgData = imagePart.inlineData || imagePart.inline_data
      generatedImage.value = `data:${imgData.mimeType || 'image/png'};base64,${imgData.data}`
    } else {
      // Check for text part which might contain refusal reason
      const textPart = responseParts.find((p: any) => p.text)
      if (textPart && textPart.text) {
        throw new Error(textPart.text)
      }
      throw new Error('No image generated. The model might have refused the request.')
    }

  } catch (err: any) {
    console.error('Generation failed:', err)
    error.value = err.response?.data?.error?.message || err.message || 'Failed to generate image'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
    
    <!-- Header -->
    <header class="text-center mb-12 animate-fade-in-down">
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
        Google Nanobanana Pro
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Experience the next generation of AI image creation.
      </p>
    </header>

    <!-- Main Content -->
    <main class="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      <div class="flex flex-col gap-4">
        <ApiKeyInput v-model="apiKey" />
        
        <!-- Cost Panel -->
        <div v-if="apiKey" class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2 text-gray-600">
            <DollarSign class="w-5 h-5 text-green-600" />
            <span class="font-medium">Session Cost</span>
          </div>
          <div class="text-xl font-bold text-gray-900">
            ${{ totalCost.toFixed(6) }}
          </div>
        </div>
      </div>

      <div v-if="apiKey" class="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100">
        <ImageGenerator 
          :loading="loading" 
          @generate="handleGenerate" 
        />


        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 animate-shake">
          <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span class="text-sm font-medium">{{ error }}</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="mt-12 flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner />
          <p class="text-gray-400 text-sm font-medium animate-pulse">Creating your masterpiece...</p>
        </div>

        <!-- Result -->
        <ImageDisplay 
          v-if="generatedImage && !loading" 
          :imageUrl="generatedImage" 
        />
      </div>

    </main>

    <!-- Footer -->
    <footer class="mt-auto py-8 text-center text-gray-400 text-sm">
      <p>&copy; {{ new Date().getFullYear() }} Kannmu. Powered by ZenMux & Google Gemini.</p>
    </footer>

  </div>
</template>

<style>
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
