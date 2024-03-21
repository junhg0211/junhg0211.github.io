<script>
	import Page from '../Page.svelte';
	import TitlePage from '../TitlePage.svelte';
	import ShortcutPage from '../ShortcutPage.svelte';
	import IntroducePage from '../IntroducePage.svelte';
	import ContactPage from '../ContactPage.svelte';
	import Navigation from '../Navigation.svelte';
</script>

<svelte:head>
	<meta name="og:title" content="Hangyeol “Sch” Jeon" />
	<meta name="og:description" content="지식을 갈구하다." />
	<meta name="og:url" content="https://sch.shtelo.org/" />
	<meta name="og:image" content="./logo/logo_dark.png" />
	<meta name="theme-color" content="#fdde59" data-react-helmet="true" />
	<meta name="viewport" content="width=device-width, initial-scale=0.7" />
	<link rel="icon" type="image/x-icon" href="./logo/logo_dark_square.png" />
	<link
		rel="stylesheet"
		as="style"
		crossorigin
		href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard.css"
	/>
	<link rel="stylesheet" href="./index.css" />
	<title>Sch | Hangyeol Jeon</title>
  <script src="./js/navigation.js"></script>
  <script src="./js/content-animation.js"></script>
</svelte:head>

<Navigation />
<div class="content-container">
	<Page name="title">
		<TitlePage />
	</Page>
	<Page name="shortcut">
		<ShortcutPage />
	</Page>
	<Page name="introduce">
		<IntroducePage />
	</Page>
	<Page name="contact">
		<ContactPage />
	</Page>
	<div class="footer">
		<p>
			이 사이트에 대한 코드는
			<a href="https://github.com/junhg0211/junhg0211.github.io">이 GitHub 링크</a>를 눌러 확인해볼
			수 있습니다.
		</p>
	</div>
</div>

<style>
  .footer {
    margin-bottom: 5rem;
  }
</style>
