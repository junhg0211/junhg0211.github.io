<script>
	function smoothScroll(query) {
		document.querySelector(query).scrollIntoView({
			behavior: 'smooth'
		});
	}
</script>

<div class="navigation" id="navigation" style="transform: translate(0, -100%)">
	<div class="content-container">
		<h3>
			<img src="/logo/logo_dark.png" alt="스치 로고" style="height: 0.9rem" />
			Hangyeol Jeon
		</h3>
		<ul class="navigation-list">
			<li><a on:click={() => smoothScroll('#title-container')}>홈</a></li>
			<li><a on:click={() => smoothScroll('#shortcut-container')}>바로가기</a></li>
			<li><a on:click={() => smoothScroll('#introduce-container')}>소개</a></li>
			<li><a on:click={() => smoothScroll('#contact-container')}>연락</a></li>
		</ul>
	</div>
</div>

<style>
	.navigation {
		position: fixed;
		width: 100vw;
		z-index: 1;
		background: linear-gradient(180deg, rgba(247, 247, 249, 1) 40%, rgba(0, 0, 0, 0) 100%);

		transition: all 0.5s;
	}

	.navigation .content-container {
		display: flex;
		flex-direction: row;
	}

	.navigation-list {
		list-style-type: none;
		display: inline-block;
		flex: 1;
		text-align: right;
	}

	.navigation-list li {
		display: inline-block;
		margin-left: 2rem;
	}
</style>
