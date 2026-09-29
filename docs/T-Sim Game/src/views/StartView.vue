<template>
  <div class="start">
    <header class="start__brand">
      <div class="logo">T</div>
      <div>
        <h1>T-Sim · 做T训练场</h1>
        <p class="dim">
          用真实 A 股与 ETF 的分钟级历史行情做回放，一轮一个交易日，练的是分时直觉。
        </p>
      </div>
    </header>

    <div v-if="loadState.loading" class="notice card">正在加载行情数据…</div>
    <div v-else-if="loadState.error" class="notice card notice--bad">
      {{ loadState.error }}
      <button class="btn" @click="boot">重试</button>
    </div>

    <template v-else>
      <section class="hero card">
        <div class="hero__level">
          <div class="hero__title">
            <span class="chip chip-accent">{{ level.name }}</span>
            <span class="faint num">{{ career.xp }} XP</span>
          </div>
          <div class="hero__progress">
            <div class="hero__progress-fill" :style="{ width: `${level.progress * 100}%` }" />
          </div>
          <p class="faint">
            <template v-if="level.next">距 {{ level.next }} 还差 {{ level.toNext }} XP</template>
            <template v-else>已到最高等级</template>
          </p>
        </div>

        <div class="hero__stats">
          <div class="stat">
            <span class="stat__value num">{{ summary.count }}</span>
            <span class="stat__label">已完成</span>
          </div>
          <div class="stat">
            <span class="stat__value num">{{ summary.count ? summary.avgScore.toFixed(0) : '--' }}</span>
            <span class="stat__label">平均分</span>
          </div>
          <div class="stat">
            <span class="stat__value num" :class="summary.totalT > 0 ? 'up' : 'down'">
              {{ summary.count ? formatSigned(summary.totalT, 0) : '--' }}
            </span>
            <span class="stat__label">累计做T</span>
          </div>
          <div class="stat">
            <span class="stat__value num" :class="career.streak > 0 ? 'up' : ''">
              {{ career.streak }}
            </span>
            <span class="stat__label">连击（最高 {{ career.bestStreak }}）</span>
          </div>
        </div>
      </section>

      <section class="modes">
        <button class="mode mode--primary" :disabled="!candidates.length" @click="start()">
          <div class="mode__icon"><InfinityIcon :size="26" /></div>
          <div class="mode__body">
            <h3>无尽模式</h3>
            <p>随机抽取历史交易日，一轮接一轮，随时停下。当前筛选下有 {{ candidates.length }} 个场景。</p>
          </div>
          <ArrowRight :size="22" />
        </button>

        <button class="mode" @click="start({ seeded: true })">
          <div class="mode__icon"><CalendarDays :size="24" /></div>
          <div class="mode__body">
            <h3>每日挑战</h3>
            <p>今天所有人拿到同一个交易日，{{ dailyDone ? '你今天已经挑战过，可以再来一次。' : '看看你能拿到什么评级。' }}</p>
          </div>
          <ArrowRight :size="20" />
        </button>

        <button class="mode" @click="go('settings')">
          <div class="mode__icon"><SlidersHorizontal :size="24" /></div>
          <div class="mode__body">
            <h3>专项训练</h3>
            <p>只练某一种形态或某一类标的：{{ filterSummary }}</p>
          </div>
          <ArrowRight :size="20" />
        </button>
      </section>

      <section class="difficulty card">
        <div class="difficulty__head">
          <span class="label">难度（决定抽到的日振幅）</span>
          <span v-if="settings.adaptive" class="chip chip-accent">自适应已开启</span>
        </div>
        <div class="difficulty__options">
          <button
            v-for="option in difficultyList"
            :key="option.key"
            class="diff"
            :class="{ active: settings.difficulty === option.key }"
            @click="updateSettings({ difficulty: option.key })"
          >
            <b>{{ option.label }}</b>
            <span>{{ option.detail }}</span>
          </button>
        </div>
        <p class="faint small">
          手续费：佣金 {{ (settings.feeConfig.commissionRate * 10000).toFixed(2) }}‱，每笔最低
          {{ settings.feeConfig.commissionMin }} 元；印花税卖出
          {{ (settings.feeConfig.stampDutyRate * 10000).toFixed(2) }}‱（仅股票）；底仓约
          {{ (settings.capitalTarget / 10000).toFixed(0) }} 万元。
          <button class="link" @click="go('settings')">调整</button>
        </p>
      </section>

      <section class="how card">
        <h3>怎么玩</h3>
        <ol>
          <li>你手上已经有一笔<b>底仓</b>，今天要在分时图上做 T。</li>
          <li>
            <b class="up">正T</b>：先低买，再卖出等量底仓；<b class="down">倒T</b>：先高卖，再低位买回。
          </li>
          <li>A 股 T+1：当天买入的股票当天不能卖，所以要先有底仓才能做 T。</li>
          <li>收盘后系统会告诉你：赚了多少、每一笔买在了什么位置、当天最理想的做法是什么。</li>
        </ol>
        <p class="faint small">
          快捷键：空格 暂停/继续 · B 买入 · S 卖出 · 1~4 选择规模 · F 跳到下一个关键点 · ↵ 收盘
        </p>
      </section>

      <footer class="start__footer">
        <span class="faint">{{ loadState.progress }}</span>
        <div class="start__links">
          <button class="btn btn-ghost" @click="go('stats')"><BarChart3 :size="16" />统计</button>
          <button class="btn btn-ghost" @click="go('settings')">
            <SlidersHorizontal :size="16" />设置
          </button>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Infinity as InfinityIcon,
  SlidersHorizontal
} from 'lucide-vue-next'
import {
  boot,
  career,
  candidates,
  level,
  loadState,
  settings,
  startRound,
  summary,
  todaySeed,
  updateSettings,
  view
} from '../composables/useGame.js'
import { DIFFICULTIES, GRANULARITIES } from '../core/scenario.js'
import { formatSigned, patternShort } from '../core/format.js'

const difficultyList = computed(() => Object.values(DIFFICULTIES))

const filterSummary = computed(() => {
  const parts = []
  parts.push(settings.kinds.length ? settings.kinds.map((k) => (k === 'etf' ? 'ETF' : '股票')).join('/') : '全部标的')
  parts.push(GRANULARITIES[settings.granularity]?.label || '任意')
  if (settings.patterns.length) parts.push(settings.patterns.map(patternShort).join('/'))
  return parts.join(' · ')
})

const dailyDone = computed(() => {
  const seed = todaySeed()
  return career.rounds.some((r) => r.seed === seed)
})

function go(target) {
  view.value = target
}

function start(options = {}) {
  startRound(options.seeded ? { seed: todaySeed() } : {})
}
</script>

<style scoped>
.start {
  width: min(940px, 100%);
  margin: 0 auto;
  padding: 24px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.start__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(140deg, #ff4d4f, #4c8dff);
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  flex: none;
}

.start__brand h1 {
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.start__brand p {
  font-size: 13px;
  margin-top: 3px;
  line-height: 1.5;
}

.notice {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 15px;
  color: var(--text-dim);
}

.notice--bad {
  color: var(--up);
}

.hero {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.hero__progress {
  height: 8px;
  margin: 8px 0 6px;
  border-radius: 99px;
  background: var(--surface-2);
  overflow: hidden;
}

.hero__progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #4c8dff, #8bd0ff);
  transition: width 0.5s ease;
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}

.stat__value {
  font-size: 20px;
  font-weight: 700;
}

.stat__label {
  font-size: 11px;
  color: var(--text-faint);
}

.modes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mode {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  text-align: left;
  transition: all 0.16s ease;
}

.mode:hover:not(:disabled) {
  border-color: var(--border-strong);
  transform: translateY(-1px);
}

.mode--primary {
  background: linear-gradient(120deg, rgba(76, 141, 255, 0.16), rgba(76, 141, 255, 0.03));
  border-color: rgba(76, 141, 255, 0.42);
}

.mode__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: var(--surface-2);
  color: var(--accent);
  flex: none;
}

.mode__body {
  flex: 1;
  min-width: 0;
}

.mode__body h3 {
  font-size: 17px;
  font-weight: 700;
}

.mode__body p {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 3px;
  line-height: 1.5;
}

.difficulty {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.difficulty__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.difficulty__options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.diff {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  text-align: left;
  transition: all 0.14s ease;
}

.diff b {
  font-size: 14px;
}

.diff span {
  font-size: 11px;
  color: var(--text-faint);
  line-height: 1.4;
}

.diff.active {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.small {
  font-size: 12px;
  line-height: 1.6;
}

.how {
  padding: 16px;
}

.how h3 {
  font-size: 15px;
  margin-bottom: 10px;
}

.how ol {
  margin: 0 0 10px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.6;
}

.how b {
  color: var(--text);
}

.start__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  flex-wrap: wrap;
}

.start__links {
  display: flex;
  gap: 8px;
}

.start__links .btn {
  min-height: 40px;
  font-size: 13px;
}

.link {
  color: var(--accent);
  text-decoration: underline;
  font-size: 12px;
  padding: 0 2px;
}

@media (max-width: 620px) {
  .hero__stats {
    grid-template-columns: 1fr 1fr;
  }

  .mode__icon {
    width: 40px;
    height: 40px;
  }
}
</style>
