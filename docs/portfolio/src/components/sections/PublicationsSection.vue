<script setup>
import SectionHeader from '../ui/SectionHeader.vue'
import TagChip from '../ui/TagChip.vue'
import { publications } from '../../data/portfolio'
</script>

<template>
  <section class="section-block" id="publications">
    <SectionHeader index="03" title="Selected Publications" />

    <div class="pub-list">
      <article
        class="pub-card"
        v-for="(item, idx) in publications"
        :key="item.title"
        v-reveal="70 * (idx + 1)"
        data-cursor-hover
      >
        <h3>{{ item.title }}</h3>
        <p class="authors">{{ item.authors }}</p>
        <p class="journal">{{ item.journal }}</p>
        <div class="tag-list">
          <TagChip v-for="tag in item.tags" :key="tag" :text="tag" />
        </div>
      </article>
    </div>
  </section>
</template>
