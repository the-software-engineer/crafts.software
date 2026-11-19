<script lang="ts">
import '@fontsource-variable/inter/opsz.css';
import interLatin from '@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2?url';
import { campaignLink } from '$lib/campaign-link';
import SubscribeForm from '$lib/components/SubscribeForm.svelte';

interface Product {
	name: string;
	href: string;
	icon: string;
}

const newsletterHref = campaignLink('https://gregory.sh/subscribe', 'body');
const makerHref = campaignLink('https://gregory.sh/', 'footer');

const products = {
	deliMeet: {
		name: 'Deli Meet',
		href: campaignLink('https://delimeet.tv/', 'body'),
		icon: 'deli-meet'
	},
	lanteon: {
		name: 'Lanteon',
		href: campaignLink('https://lanteon.app/', 'body'),
		icon: 'lanteon'
	},
	duffDobble: {
		name: 'DuffDobble',
		href: campaignLink('https://gregory.sh/blog/kids-building-with-ai', 'body'),
		icon: 'duffdobble'
	},
	flareClues: {
		name: 'FlareClues',
		href: campaignLink('https://flareclues.com/', 'body'),
		icon: 'flareclues'
	},
	protectMySim: {
		name: 'Protect My Sim',
		href: campaignLink('https://protectmysim.com/', 'body'),
		icon: 'protect-my-sim'
	}
} satisfies Record<string, Product>;

const socials = [
	{
		name: 'LinkedIn',
		href: 'https://linkedin.com/in/tjmgregory',
		path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
	},
	{
		name: 'X',
		href: 'https://x.com/tjmgregory',
		path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
	},
	{
		name: 'Threads',
		href: 'https://www.threads.com/@tjmgregory',
		path: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z'
	},
	{
		name: 'Bluesky',
		href: 'https://bsky.app/profile/tjmgregory.bsky.social',
		path: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z'
	},
	{
		name: 'Mastodon',
		href: 'https://mastodon.social/@tjmgregory',
		path: 'M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z'
	}
];

const focusRing =
	'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900';
</script>

<svelte:head>
  <title>crafts.software - The Software Engineer Ltd.</title>
  <meta
    name="description"
    content="Ship small, learn fast. The Software Engineer Ltd. builds and tests ideas with real people while the world keeps changing."
  />
  <link rel="preload" href={interLatin} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{#snippet product(item: Product)}
  <a
    href={item.href}
    class="whitespace-nowrap rounded-sm font-semibold text-gray-900 [word-spacing:normal] {focusRing}"
    ><img
      src="/products/{item.icon}-72.png"
      srcset="/products/{item.icon}-48.png 48w, /products/{item.icon}-72.png 72w, /products/{item.icon}-108.png 108w"
      sizes="(min-width: 768px) 36px, 24px"
      alt=""
      width="36"
      height="36"
      class="mr-u8 mt-u5 inline-block h-u24 w-u24 rounded-u6 align-top md:mr-u10 md:mt-u10 md:h-u36 md:w-u36 md:rounded-u8"
    /><span
      class="underline decoration-[length:calc(2*var(--u,1px))] underline-offset-[calc(5*var(--u,1px))] transition-colors hover:decoration-gray-400 md:underline-offset-[calc(7*var(--u,1px))]"
      >{item.name}</span
    ></a
  >
{/snippet}

<div class="board mx-auto w-full px-6 font-inter antialiased [font-synthesis:none] md:w-u960 md:px-0">
  <header class="flex flex-col items-start gap-u28 pt-u48 md:gap-u32 md:pt-u88">
    <div>
      <img src="/icon-rounded.svg" alt="" width="80" height="80" class="h-u64 w-u64 md:h-u80 md:w-u80" />
      <h1
        class="mt-u20 text-balance text-u28 font-bold leading-u34 tracking-[-0.025em] text-gray-900 md:mt-u24 md:text-u48 md:leading-u48"
      >
        The Software Engineer Ltd.
      </h1>
    </div>
    <nav aria-label="Newsletter and social links" class="flex flex-col items-start gap-u12 md:flex-row md:items-center">
      <a
        href={newsletterHref}
        class="inline-flex h-11 items-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-medium leading-[18px] text-white transition-colors hover:bg-gray-800 md:h-u44 md:gap-u8 md:rounded-u8 md:px-u20 md:text-u14 md:leading-u18 {focusRing}"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" class="shrink-0 md:h-u16 md:w-u16">
          <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#FFFFFF" stroke-width="2" />
          <path
            d="M22 7l-10 6L2 7"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Newsletter
      </a>
      <ul class="flex gap-2 md:gap-u12">
        {#each socials as social (social.name)}
          <li>
            <a
              href={social.href}
              aria-label={social.name}
              class="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:border-gray-400 hover:bg-gray-50 md:h-u44 md:w-u44 md:rounded-u8 {focusRing}"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" class="md:h-u16 md:w-u16">
                <path d={social.path} fill="#374151" />
              </svg>
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </header>

  <main class="flex flex-col gap-u40 pb-u64 pt-u56 md:gap-u56 md:pb-u96 md:pt-u96">
    <!-- The board sets each word apart by a fixed gap (6px, 11px on desktop), a little wider than a space. -->
    <p
      class="text-u22 leading-u34 tracking-[-0.01em] text-gray-700 [word-spacing:calc(1*var(--u,1px))] md:-my-u2 md:text-u36 md:leading-u56 md:tracking-[-0.015em] md:[word-spacing:calc(3.1*var(--u,1px))]"
    >
      On the side, I make small things I've wanted for years. So far:
      {@render product(products.deliMeet)} for livelier Google Meets,
      {@render product(products.lanteon)} for screen time goals your people can see,
      {@render product(products.duffDobble)}, the party game my nieces and nephews built by voice,
      {@render product(products.flareClues)}, the symptom tracker that calls you, and
      {@render product(products.protectMySim)} to stop overpaying for mobile.
    </p>

    <section class="flex flex-col gap-u20 border-t border-gray-300 pt-u32 md:gap-u24 md:pt-u40">
      <p class="text-u18 leading-u28 tracking-[-0.005em] text-gray-700 md:max-w-u704 md:text-u24 md:leading-u36 md:tracking-[-0.01em]">
        The big item is under wraps. Newsletter readers hear about it first.
      </p>
      <SubscribeForm />
    </section>
  </main>

  <footer class="pb-u40 md:pb-u48">
    <p class="text-sm leading-5 text-gray-500 md:text-u14 md:leading-u20">
      Made by <a
        href={makerHref}
        class="relative rounded-sm underline decoration-gray-400 decoration-1 underline-offset-[3px] transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] hover:text-gray-700 hover:decoration-gray-500 {focusRing}"
        >Theo Gregory</a
      >
    </p>
  </footer>
</div>

<style>
  /*
   * --u is one pixel of the Paper board, sized so the board fits the screen.
   * Desktop board: 1112px scale; the stripe and divider (5px) do not.
   * Mobile board: 900px scale; the stripe, divider, controls and footer line
   * (209px) do not. The mobile width term keeps the sentence within the
   * board's 11 lines, so 900 is an upper bound. 8px of slack absorbs rounding.
   * Below the lower bound (a 16px sentence on mobile) the page scrolls.
   */
  .board {
    --u: clamp(0.728px, min((100svh - 217px) / 900, (100vw - 48px) / 342), 1px);
    --min-text: 14px;
  }

  @media (min-width: 768px) {
    .board {
      --u: clamp(0.55px, min(100vw / 1056, (100svh - 13px) / 1112), 1px);
      --min-text: 12px;
    }
  }
</style>
