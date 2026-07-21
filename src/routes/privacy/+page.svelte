<script lang="ts">
// Email encoded as base64 to deter scrapers. Decoded only on click.
const contactEmailBase64 = 'c2l0ZUBjcmFmdHMuc29mdHdhcmU=';

function handleEmailClick() {
	const email = atob(contactEmailBase64);
	window.location.href = `mailto:${email}`;
}
</script>

<svelte:head>
  <title>Privacy Policy - crafts.software</title>
  <meta
    name="description"
    content="Privacy policy for The Software Engineer Ltd. and its crafts.software sites."
  />
</svelte:head>

<main class="min-h-[calc(100vh-4px)] px-6 py-16">
  <div class="mx-auto max-w-2xl">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      Privacy Policy
    </h1>
    <p class="mt-2 text-sm text-gray-500">Effective date: 20 July 2026</p>

    <div class="mt-10 space-y-8 text-gray-700">
      <section>
        <h2 class="text-lg font-semibold text-gray-900">Who we are</h2>
        <p class="mt-2 leading-relaxed">
          This site is run by The Software Engineer LTD, a UK company. This
          policy covers crafts.software and its subdomain project sites (for
          example landing pages for individual products or ideas built by
          the company).
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">Analytics</h2>
        <p class="mt-2 leading-relaxed">
          We use Umami, an analytics tool we host ourselves. It does not use
          cookies, does not track you across other sites, and does not show
          you ads. We do not store your IP address for profiling. Because we
          don't use cookies or any other persistent identifier, we don't show
          a cookie consent banner. There is nothing to consent to.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">
          Data you give us
        </h2>
        <p class="mt-2 leading-relaxed">
          If you sign up to a waitlist or newsletter on one of our sites, we
          store the email address you give us in Cloudflare KV, a data
          store provided by Cloudflare. We use that email only to send you
          the thing you signed up for. We never sell it or share it with
          anyone else. You can unsubscribe at any time, either using the
          link in any email we send or by emailing us directly.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">
          Third parties we use
        </h2>
        <p class="mt-2 leading-relaxed">
          We use Cloudflare for hosting and content delivery, and an email
          sending service to deliver newsletters. These providers process
          data on our behalf to keep the sites running and to send the
          emails you asked for.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">
          Internal tools on subdomains
        </h2>
        <p class="mt-2 leading-relaxed">
          Some subdomains run internal company tools rather than public
          sites, for example the social media posting tool at
          postiz.crafts.software. These are for internal use only and are
          access-restricted. They are not open to the public and do not
          collect data from site visitors.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">Your rights</h2>
        <p class="mt-2 leading-relaxed">
          We are a UK company, so UK GDPR applies. You can ask us what data
          we hold about you, ask us to delete it, or ask for a copy of it.
          Email us and we'll sort it out. This page is a plain, honest
          description of what we do, not a substitute for legal advice.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">Contact</h2>
        <p class="mt-2 leading-relaxed">
          Questions about this policy or your data?
          <button
            type="button"
            onclick={handleEmailClick}
            class="cursor-pointer font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
            >Email us</button
          >.
        </p>
      </section>
    </div>

    <p class="mt-12 text-sm">
      <a href="/" class="text-gray-500 underline underline-offset-2 hover:text-gray-700"
        >Back to home</a
      >
    </p>
  </div>
</main>
