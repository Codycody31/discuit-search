<template>
  <header>
    <h1>Discuit Search</h1>
  </header>
  <main>
    <input @input="search" type="text" placeholder="Search..." />
    <ul id="results">
      <li v-for="result in results" :key="result.id">
        <CommunityComponent :community="result" />
      </li>
    </ul>
  </main>
</template>

<script>
import CommunityComponent from './components/CommunityComponent.vue'

export default {
  data() {
    return {
      results: []
    }
  },
  components: {
    CommunityComponent
  },
  methods: {
    search(event) {
      const query = event.target.value

      if (query.length < 3) {
        this.results = []
        return
      }

      let baseURL
      if (process.env.NODE_ENV === 'development') {
        baseURL = 'http://localhost:5000/api'
      } else {
        baseURL = '/api'
      }

      fetch(`${baseURL}/search?query=${query}&index=communities`)
        .then((response) => response.json())
        .then((data) => {
          this.results = data.data.hits
        })
    }
  }
}
</script>
