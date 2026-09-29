<template>
  <div class="app" :class="{ 'app--playing': view === 'play' && session }">
    <PlayView v-if="view === 'play' && session" />
    <StatsView v-else-if="view === 'stats'" />
    <SettingsView v-else-if="view === 'settings'" />
    <StartView v-else />
  </div>

  <transition name="toast">
    <div v-if="toast.visible" class="toast" :class="`toast--${toast.tone}`">
      {{ toast.text }}
    </div>
  </transition>
</template>

<script setup>
import { onMounted } from 'vue'
import PlayView from './views/PlayView.vue'
import StartView from './views/StartView.vue'
import StatsView from './views/StatsView.vue'
import SettingsView from './views/SettingsView.vue'
import { boot, session, toast, view } from './composables/useGame.js'

onMounted(boot)
</script>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1100px 600px at 12% -8%, rgba(76, 141, 255, 0.09), transparent 60%),
    radial-gradient(900px 520px at 92% 4%, rgba(255, 77, 79, 0.07), transparent 62%),
    var(--bg);
}

.app > * {
  width: 100%;
}

/* While a round is running the play view owns exactly one viewport: an auto
   height here would let the deepest column (chart + coach + playback bar)
   stretch the page and clip the controls on short screens. */
.app--playing {
  height: 100dvh;
  overflow: hidden;
}

.app--playing > * {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}

/* On phones the play view scrolls as a single column instead of pinning to the
   viewport: a chart plus a full order ticket never fits above the fold. */
@media (max-width: 860px) {
  .app--playing {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }

  .app--playing > * {
    height: auto;
    min-height: 100dvh;
  }
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 60;
  padding: 12px 20px;
  border-radius: 999px;
  background: var(--surface-3);
  border: 1px solid var(--border-strong);
  box-shadow: var(--shadow);
  font-size: 14px;
  font-weight: 600;
  max-width: min(92vw, 520px);
  text-align: center;
}

.toast--warn {
  background: var(--warn-soft);
  border-color: rgba(255, 176, 32, 0.45);
  color: #ffd489;
}

.toast--good {
  background: var(--down-soft);
  border-color: rgba(18, 196, 139, 0.45);
  color: #7ef0c0;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
