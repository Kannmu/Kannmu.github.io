<template>
  <div class="bar card">
    <button class="bar__play" :class="{ playing }" @click="$emit('toggle')">
      <component :is="playing ? Pause : Play" :size="20" />
      <span>{{ playing ? '暂停' : '继续' }}</span>
      <kbd>空格</kbd>
    </button>

    <button class="bar__step" :disabled="playing" @click="$emit('step')">
      <StepForward :size="17" />
      <span>单步</span>
    </button>

    <button class="bar__signal" @click="$emit('signal')">
      <Crosshair :size="17" />
      <span>下一关键点</span>
    </button>

    <div class="bar__speeds">
      <button
        v-for="speed in SPEEDS"
        :key="speed.value"
        class="speed num"
        :class="{ active: speed.value === currentSpeed }"
        @click="$emit('speed', speed.value)"
      >
        {{ speed.label }}
      </button>
    </div>

    <div class="bar__progress num">{{ progressText }}</div>

    <button class="btn btn-primary bar__close" @click="$emit('settle')">
      <Flag :size="17" />
      <span>收盘结算</span>
      <kbd>↵</kbd>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Crosshair, Flag, Pause, Play, StepForward } from 'lucide-vue-next'

const props = defineProps({
  playing: { type: Boolean, default: false },
  currentSpeed: { type: Number, default: 8 },
  barIndex: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  timeLabel: { type: String, default: '09:30' },
  speeds: { type: Array, default: () => [] }
})

defineEmits(['toggle', 'step', 'signal', 'speed', 'settle'])

const SPEEDS = computed(() => props.speeds)
const progressText = computed(() => `${props.timeLabel} · ${props.barIndex + 1}/${props.total}`)
</script>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  flex-wrap: wrap;
}

.bar__play,
.bar__step,
.bar__signal {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 46px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.14s ease;
}

.bar__play:hover,
.bar__step:hover:not(:disabled),
.bar__signal:hover {
  background: var(--surface-3);
}

.bar__play.playing {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: #b9d1ff;
}

.bar__speeds {
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  border: 1px solid var(--border);
}

.speed {
  padding: 0 10px;
  height: 40px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
}

.speed.active {
  background: var(--surface-3);
  color: var(--text);
}

.bar__progress {
  font-size: 13px;
  color: var(--text-faint);
  margin-left: auto;
  padding-right: 4px;
}

.bar__close {
  height: 46px;
}

kbd {
  padding: 1px 5px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.22);
  font-family: var(--mono);
  font-size: 10px;
  opacity: 0.7;
}

@media (max-width: 900px) {
  .bar {
    gap: 6px;
  }

  .bar__step,
  .bar__signal {
    flex: 1;
    justify-content: center;
  }

  .bar__progress {
    order: 5;
    width: 100%;
    text-align: center;
    margin: 0;
  }

  .bar__close {
    flex: 1;
    order: 4;
  }

  .bar__speeds {
    order: 6;
    width: 100%;
    justify-content: space-between;
  }

  .speed {
    flex: 1;
  }
}
</style>
