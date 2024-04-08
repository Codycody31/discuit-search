<script setup>
import { defineProps } from 'vue'
import MarkdownIt from 'markdown-it'
const markdown = new MarkdownIt()

const props = defineProps(['community'])
const community = props.community
</script>

<template>
  <a :href="`https://discuit.net/${community.name}`" target="_blank" rel="noopener noreferrer">
    <li>
      <h3>{{ community.name }}</h3>
      <p v-if="community.about" v-html="markdown.render(community.about)"></p>
      <p>{{ community.noMembers }} members</p>
    </li>
  </a>
</template>

<style scoped>
li {
  list-style-type: none;
  border: 0.125rem solid canvastext;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.25s;

  &:hover {
    background-color: #444;
  }
}

p {
  word-break: break-word;
}

a {
  text-decoration: none;
  color: canvastext;
  height: 100%;
}
</style>
