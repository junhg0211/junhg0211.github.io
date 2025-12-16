<script>
  let nameDecoration;
  let angle = 0;

  setInterval(() => {
    angle++;
    angle %= 360;

    if (nameDecoration == undefined || nameDecoration == null)
      return;

    nameDecoration.style.background = `linear-gradient(${angle}deg, #ffce00 0%, #19191e 100%)`;
    nameDecoration.style.backgroundClip = `text`;
  }, 1000/24);
</script>

<img src="./logo/logo_mixed.svg" alt="스치 로고" style="height: 7rem" />
<h1>Hangyeol <span class="name-decoration" bind:this={nameDecoration}>“Sch”</span> Jeon</h1>
<p>지식을 갈구하다.</p>

<style>
  h1 {
    font-size: 4rem;
    margin: 0.5rem 0 0.2rem 0;
    letter-spacing: -2px;
  }

	.name-decoration {
		/* color: #ffce00; */
		background: linear-gradient(0deg, #ffce00 00%, #19191e 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>

