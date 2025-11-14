<script setup>
import { ref } from 'vue'

const helpInfo = ref({
  title: 'Hilfe & Support',
  subtitle: 'Wir unterstützen Sie gerne.',
  email: 'support@wieneroeffis.at',
  phone: '+43 1 1234 100',
  serviceTimes: 'Montag–Freitag, 08:00–17:00 Uhr',
  emergencyNote:
    'Bei technischen Problemen oder Fragen zu Bestellungen stehen wir Ihnen jederzeit zur Verfügung.'
})

const supportOptions = ref([
  {
    heading: 'E-Mail-Support',
    text: 'Für allgemeine Fragen, technische Unterstützung oder Feedback erreichen Sie uns jederzeit per E-Mail.',
    link: `mailto:${helpInfo.value.email}`
  },
  {
    heading: 'Telefonischer Kontakt',
    text: 'Unser Serviceteam hilft Ihnen während der Geschäftszeiten persönlich weiter.',
    link: `tel:${helpInfo.value.phone.replace(/\\s+/g, '')}`
  },
  {
    heading: 'Vor-Ort Beratung',
    text: 'Für persönliche Anliegen können Sie nach Terminvereinbarung in unserer Servicestelle vorbeikommen.'
  }
])
</script>

<template>
  <main class="help">
    <h1>{{ helpInfo.title }}</h1>
    <p class="subtitle">{{ helpInfo.subtitle }}</p>

    <section>
      <h2>Wie können wir Ihnen helfen?</h2>
      <p>{{ helpInfo.emergencyNote }}</p>

      <ul>
        <li v-for="(opt, i) in supportOptions" :key="i" class="option">
          <h3>{{ opt.heading }}</h3>
          <p>{{ opt.text }}</p>
          <a v-if="opt.link" :href="opt.link" class="contact-link">Jetzt kontaktieren</a>
        </li>
      </ul>
    </section>

    <section>
      <h2>Kontaktinformationen</h2>
      <p><strong>E-Mail:</strong> {{ helpInfo.email }}</p>
      <p><strong>Telefon:</strong> {{ helpInfo.phone }}</p>
      <p><strong>Servicezeiten:</strong> {{ helpInfo.serviceTimes }}</p>
    </section>
  </main>
</template>

<style scoped>
.help {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  line-height: 1.6;
}

.help h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;
  color: #555;
}

.help h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.help h3 {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

.option {
  margin-bottom: 1rem;
}

.contact-link {
  display: inline-block;
  margin-top: 0.25rem;
  text-decoration: underline;
  cursor: pointer;
}
</style>
