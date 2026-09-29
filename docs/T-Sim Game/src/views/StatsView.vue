<template>
  <div class="stats">
    <header class="stats__head">
      <button class="btn btn-ghost" @click="view = 'start'"><ArrowLeft :size="16" />返回</button>
      <h1>训练统计</h1>
      <button class="btn btn-ghost" @click="view = 'settings'">
        <SlidersHorizontal :size="16" />设置
      </button>
    </header>

    <div v-if="!summary.count" class="empty card">
      还没有完成任何一轮。回到首页开一局，这里会开始记录你的直觉曲线。
    </div>

    <template v-else>
      <section class="grid">
        <div class="metric card">
          <span class="label">完成轮数</span>
          <b class="num">{{ summary.count }}</b>
        </div>
        <div class="metric card">
          <span class="label">平均总分</span>
          <b class="num">{{ summary.avgScore.toFixed(1) }}</b>
        </div>
        <div class="metric card">
          <span class="label">做T胜率</span>
          <b class="num">{{ (summary.winRate * 100).toFixed(0) }}%</b>
        </div>
        <div class="metric card">
          <span class="label">平均每轮</span>
          <b class="num" :class="summary.avgBp > 0 ? 'up' : 'down'">
            {{ formatSignedNumber(summary.avgBp, 1) }} bp
          </b>
        </div>
        <div class="metric card">
          <span class="label">累计做T收益</span>
          <b class="num" :class="summary.totalT > 0 ? 'up' : 'down'">
            {{ formatSigned(summary.totalT, 0) }}
          </b>
        </div>
        <div class="metric card">
          <span class="label">最高连击</span>
          <b class="num">{{ career.bestStreak }}</b>
        </div>
      </section>

      <section class="card block">
        <h2>按日内形态拆解</h2>
        <p class="faint small">
          这是最有用的一张表：做T赚不赚钱，首先取决于你有没有认出今天是什么日子。
        </p>
        <div class="table">
          <div class="table__row table__row--head">
            <span>形态</span><span>轮数</span><span>胜率</span><span>平均 bp</span><span>平均分</span>
          </div>
          <div v-for="row in patternRows" :key="row.code" class="table__row">
            <span class="table__name">
              <b>{{ row.label }}</b>
              <small class="faint">{{ row.hint }}</small>
            </span>
            <span class="num">{{ row.count }}</span>
            <span class="num">{{ (row.winRate * 100).toFixed(0) }}%</span>
            <span class="num" :class="row.avgBp > 0 ? 'up' : 'down'">
              {{ formatSignedNumber(row.avgBp, 1) }}
            </span>
            <span class="num">{{ row.avgScore.toFixed(0) }}</span>
          </div>
        </div>
      </section>

      <section v-if="mistakeRows.length" class="card block">
        <h2>反复出现的坏习惯</h2>
        <p class="faint small">按出现次数排序。先改掉排第一的那个，收益曲线通常立刻变化。</p>
        <div class="mistakes">
          <div v-for="row in mistakeRows" :key="row.code" class="mistake">
            <div class="mistake__head">
              <b>{{ row.label }}</b>
              <span class="num faint">{{ row.count }} 次</span>
            </div>
            <p class="faint small">{{ row.tip }}</p>
          </div>
        </div>
      </section>

      <section class="card block">
        <h2>最近的对局</h2>
        <div class="rounds">
          <button v-for="round in recentRounds" :key="round.key + round.ts" class="round" @click="replay(round)">
            <span class="round__grade" :class="`g-${round.rating}`">{{ round.rating }}</span>
            <span class="round__main">
              <b>{{ round.name }}</b>
              <small class="faint">
                {{ formatDate(round.date) }} · {{ patternShort(round.pattern) }} ·
                {{ round.granularity === 'm1' ? '1分' : '5分' }} · {{ round.fills }} 笔
              </small>
            </span>
            <span class="round__t num" :class="round.t > 0 ? 'up' : 'down'">
              {{ formatSigned(round.t, 0) }}
            </span>
            <span class="round__bp num faint">{{ formatSignedNumber(round.tBp, 0) }}bp</span>
          </button>
        </div>
      </section>

      <section class="card block danger">
        <h2>重置进度</h2>
        <p class="faint small">清空全部对局记录、XP 与连击。数据文件不受影响。</p>
        <button class="btn" @click="confirmReset">清空训练记录</button>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeft, SlidersHorizontal } from 'lucide-vue-next'
import { career, resetProgress, startRound, summary, view } from '../composables/useGame.js'
import { DAY_PATTERNS } from '../core/patterns.js'
import { MISTAKES } from '../core/scoring.js'
import { formatDate, formatSigned, formatSignedNumber, patternShort } from '../core/format.js'

const patternRows = computed(() =>
  Object.entries(summary.value.byPattern)
    .map(([code, bucket]) => ({
      code,
      label: DAY_PATTERNS[code]?.label || code,
      hint: DAY_PATTERNS[code]?.hint || '',
      ...bucket
    }))
    .sort((a, b) => b.count - a.count)
)

const mistakeRows = computed(() =>
  summary.value.mistakes.map((m) => ({
    ...m,
    label: MISTAKES[m.code]?.label || m.code,
    tip: MISTAKES[m.code]?.tip || ''
  }))
)

const recentRounds = computed(() => career.rounds.slice(-14).reverse())

function replay(round) {
  startRound({ pinned: { secid: round.secid, date: round.date, seed: round.key } })
}

function confirmReset() {
  if (window.confirm('确定清空所有训练记录吗？此操作不可撤销。')) resetProgress()
}
</script>

<style scoped>
.stats {
  width: min(940px, 100%);
  margin: 0 auto;
  padding: 20px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stats__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stats__head h1 {
  font-size: 20px;
  font-weight: 700;
}

.stats__head .btn {
  min-height: 42px;
  font-size: 13px;
}

.empty {
  padding: 32px 20px;
  text-align: center;
  color: var(--text-dim);
  font-size: 14px;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.metric {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric b {
  font-size: 22px;
}

.block {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.block h2 {
  font-size: 16px;
  font-weight: 700;
}

.small {
  font-size: 12px;
  line-height: 1.6;
}

.table {
  display: flex;
  flex-direction: column;
}

.table__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px 56px 72px 56px;
  gap: 8px;
  align-items: center;
  padding: 10px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
  text-align: right;
}

.table__row--head {
  color: var(--text-faint);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom-color: var(--border);
}

.table__name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.table__name small {
  font-size: 11px;
}

.mistakes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
}

.mistake {
  padding: 11px 13px;
  border-radius: var(--radius-sm);
  background: var(--warn-soft);
  border: 1px solid rgba(255, 176, 32, 0.24);
}

.mistake__head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: baseline;
}

.mistake__head b {
  font-size: 14px;
  color: #ffd489;
}

.rounds {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.round {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) auto 56px;
  gap: 10px;
  align-items: center;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  text-align: left;
  transition: background 0.14s ease;
}

.round:hover {
  background: var(--surface-3);
}

.round__grade {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 800;
  color: #05070b;
  background: var(--surface-3);
}

.g-S {
  background: linear-gradient(140deg, #ffe07a, #ffb020);
}

.g-A {
  background: linear-gradient(140deg, #7ef0c0, #12c48b);
}

.g-B {
  background: linear-gradient(140deg, #9dc0ff, #4c8dff);
}

.g-D {
  background: linear-gradient(140deg, #ff9a9b, #ff4d4f);
}

.round__main {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.round__main small {
  font-size: 11px;
}

.round__t {
  font-size: 15px;
  font-weight: 700;
}

.round__bp {
  font-size: 11px;
  text-align: right;
}

.danger .btn {
  align-self: flex-start;
  color: var(--up);
  border-color: rgba(255, 77, 79, 0.35);
}
</style>
