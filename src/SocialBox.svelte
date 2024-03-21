<script>
	export let src;
	export let alt;
	export let href="#";
	export let name;
	export let profile;
</script>

<div class="social-box">
  <a {href} target={href === "#" ? "" : "_blank"}>
		<img {src} {alt} class="social-logo" />
	</a>
	<p class="social-name">{name}</p>
	{#if profile}
		<p class="social-profile">{profile}</p>
	{/if}
</div>

<style>
	.social-box {
		width: 180px;
		display: inline-block;
		margin-bottom: 2rem;
	}
	.social-logo {
		width: 80px;
		border-radius: 20px;
	}
	.social-name {
		margin: 10px 0 8px 0;
		font-weight: bold;
	}
	.social-profile {
		margin: 0;
	}
</style>
