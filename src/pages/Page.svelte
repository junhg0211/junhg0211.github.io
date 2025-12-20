<script>
  export let name;
</script>

<div class="content-box" id={name + "-container"}>
  <div class="content" id={name + "-content"}>
		<slot />
	</div>
</div>

<style>
	.content-box {
		min-height: 100vh;
		display: flex;
		flex-direction: row;
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
	.content {
		transition: all 0.5s;
		align-self: center;
		margin: 200px 0;
	}
</style>
