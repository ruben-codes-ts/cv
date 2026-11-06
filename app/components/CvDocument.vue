<script setup lang="ts">
import { useCv, labels, isUrl, type Lang } from '~/composables/useCv'

const props = defineProps<{ lang: Lang }>()
const cv = useCv(props.lang)
const t = labels[props.lang]

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

useHead({
  title: `${cv.name} · CV`,
  htmlAttrs: { lang: props.lang },
  meta: [{ name: 'description', content: cv.headline }],
})
</script>

<template>
  <main class="cv">
    <nav class="toolbar">
      <NuxtLink :to="t.otherHref">{{ t.other }}</NuxtLink>
      <a :href="`/ruben-versantvoort-cv-${lang}.pdf`" download>{{ t.pdf }}</a>
    </nav>

    <header class="masthead">
      <h1>{{ cv.name }}</h1>
      <p class="headline">{{ cv.headline }}</p>
      <p class="contact">
        <span>{{ cv.location }}</span>
        <template v-for="(url, key) in cv.links" :key="key">
          <a v-if="isUrl(url)" :href="url">{{ host(url) }}</a>
        </template>
      </p>
    </header>

    <section class="summary">
      <p>{{ cv.summary }}</p>
    </section>

    <section class="block">
      <h2>{{ t.experience }}</h2>
      <div class="body">
        <article v-for="job in cv.experience" :key="job.company" class="job">
          <header class="row">
            <h3>{{ job.company }}<span v-if="job.location" class="muted">, {{ job.location }}</span></h3>
            <span class="period">{{ job.period }}</span>
          </header>
          <div v-for="role in job.roles" :key="role.title" class="role">
            <header v-if="job.roles.length > 1 || role.period" class="row">
              <h4>{{ role.title }}</h4>
              <span v-if="role.period" class="period">{{ role.period }}</span>
            </header>
            <h4 v-else>{{ role.title }}</h4>
            <ul v-if="role.highlights?.length">
              <li v-for="h in role.highlights" :key="h">{{ h }}</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <section class="block">
      <h2>{{ t.projects }}</h2>
      <div class="body">
        <article v-for="p in cv.projects" :key="p.name" class="project">
          <h3><a :href="`https://${p.name}`">{{ p.name }}</a></h3>
          <p>{{ p.description }}</p>
        </article>
      </div>
    </section>

    <section class="block">
      <h2>{{ t.education }}</h2>
      <div class="body">
        <article v-for="e in cv.education" :key="e.school">
          <header class="row">
            <h3>{{ e.programme }}<span class="muted">, {{ e.school }}</span></h3>
            <span class="period">{{ e.period }}</span>
          </header>
          <p class="note">{{ e.note }}</p>
        </article>
      </div>
    </section>

    <section class="block">
      <h2>{{ t.skills }}</h2>
      <dl class="body skills">
        <template v-for="(items, group) in cv.skills" :key="group">
          <dt>{{ t.skillGroups[group] ?? group }}</dt>
          <dd>{{ items.join(' · ') }}</dd>
        </template>
      </dl>
    </section>

    <section class="block">
      <h2>{{ t.languages }}</h2>
      <p class="body">{{ cv.spoken_languages.join(' · ') }}</p>
    </section>
  </main>
</template>
