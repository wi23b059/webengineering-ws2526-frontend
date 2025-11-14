<script setup>
import { ref } from 'vue'

const company = {
  name: 'Wiener Öffis GmbH',
  street: 'Wienerbergstraße 20',
  zipCity: '1100 Wien',
  phone: '+43 1 1234 0',
  fax: '+43 1 1234 56789',
  email: 'post@wieneroeffis.at',
  web: 'www.wieneroeffis.at', // falls du https:// willst → einfach ändern
  firmenbuchnummer: '141553g',
  firmenbuchgericht: 'Handelsgericht Wien',
  uid: 'ATU48066008'
}

const geschaeftsfuehrung = ref([
  { title: 'Mag. Thomas Berger', role: 'Geschäftsführer – Betrieb & Vertrieb' },
  { title: 'Dipl.-Ing. Martina Koller', role: 'Geschäftsführerin – Technik & Anlagen' },
  { title: 'MMag. Lukas Huber', role: 'Geschäftsführer – Finanzen, Recht, Personal & IT' }
])

const aufsichtsrat = ref({
  vorsitz: 'Mag. Christina Streub',
  stellvertreter: 'Dr. Martin Leidenfried',
  mitglieder: [
    'Dr. Peter Jansik',
    'Mag. Martha Masulenko',
    'DI Beate Tauscher'
  ],
  arbeitnehmervertreter: [
    'Hanno Sachs',
    'Ivo Zebic',
    'Anna Lieb'
  ]
})

const blattlinie =
  `Die vorliegende Webseite ist ein Online-Angebot der ${company.name}. Unter ${company.web} werden Informations- und Online-Dienste zu Leistungen und Produkten des Unternehmens bereitgestellt.`
</script>

<template>
  <main class="impressum">
    <h1>Impressum</h1>

    <section>
      <h2>Offenlegung gemäß § 25 MedienG, § 14 UGB, § 5 ECG</h2>
      <address>
        <strong>{{ company.name }}</strong><br />
        {{ company.street }}<br />
        {{ company.zipCity }}<br />

        <a :href="`tel:${company.phone.replace(/\\s+/g, '')}`">Telefon: {{ company.phone }}</a><br />
        <a :href="`fax:${company.fax.replace(/\\s+/g, '')}`">Fax: {{ company.fax }}</a><br />
        <a :href="`mailto:${company.email}`">E-Mail: {{ company.email }}</a><br />

        <!-- FIX: vorher Regex im Template → jetzt fixed -->
        <a :href="webUrl" target="_blank" rel="noopener noreferrer">
          Web: {{ company.web }}
        </a><br />

        Firmenbuchnummer: {{ company.firmenbuchnummer }}<br />
        Firmenbuchgericht: {{ company.firmenbuchgericht }}<br />
        UID-Nummer: {{ company.uid }}
      </address>
    </section>

    <section>
      <h2>Geschäftsführung</h2>
      <ul>
        <li v-for="(g, i) in geschaeftsfuehrung" :key="i">
          <strong>{{ g.title }}</strong> — {{ g.role }}
        </li>
      </ul>
    </section>

    <section>
      <h2>Aufsichtsrat</h2>
      <p><strong>Vorsitzende:</strong> {{ aufsichtsrat.vorsitz }}</p>
      <p><strong>Vorsitzende-Stellvertreter:</strong> {{ aufsichtsrat.stellvertreter }}</p>

      <h3>Mitglieder</h3>
      <ul>
        <li v-for="(m, i) in aufsichtsrat.mitglieder" :key="i">{{ m }}</li>
      </ul>

      <h3>Arbeitnehmervertreter*innen</h3>
      <ul>
        <li v-for="(a, i) in aufsichtsrat.arbeitnehmervertreter" :key="i">{{ a }}</li>
      </ul>
    </section>

    <section>
      <h2>Offenlegung der Blattlinie gemäß §25 Abs. 4 Mediengesetz</h2>
      <p>{{ blattlinie }}</p>
    </section>
  </main>
</template>

<style scoped>
.impressum {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
}

.impressum h1 {
  font-size: 2rem;       /* deutlich größer */
  font-weight: 700;
  margin-bottom: 1rem;
}

.impressum h2 {
  font-size: 1.5rem;     /* mittlere Größe */
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.impressum h3 {
  font-size: 1.25rem;    /* kleinere Abschnittsüberschrift */
  font-weight: 500;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

</style>
