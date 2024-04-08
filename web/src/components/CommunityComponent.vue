<script setup lang="ts">
interface Community {
  id: number
  name: string
  about: string | null
}
const community: Community = defineProps<{ community: Community }>().community
</script>

<template>
  <a :href="`https://discuit.net/${community.name}`">
    <li>
      <h3>{{ community.name }}</h3>
      <p :inner-h-t-m-l="community.about"></p>
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
