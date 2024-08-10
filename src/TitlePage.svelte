<script>
  let nameDecoration;
  let angle = 0;

  /*
  setInterval(() => {
    angle++;
    angle %= 360;

    if (nameDecoration == undefined || nameDecoration == null)
      return;

    nameDecoration.style.background = `linear-gradient(${angle}deg, #ffcf00 20%, #6bd94a 80%, #00cfcf 100%)`;
    nameDecoration.style.backgroundClip = `text`;
  }, 1000/24);
  */
</script>

<img src="./logo/logo_mixed.svg" alt="스치 로고" style="width: 8rem" />
<h1>Hangyeol <span class="name-decoration" bind:this={nameDecoration}>“Sch”</span> Jeon</h1>
<p>지식을 갈구하다.</p>

<style>
	.name-decoration {
		color: #ffcf00;
    /*
		background: linear-gradient(90deg, #ffcf00 10%, #6bd94a 70%, #00cfcf 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
    */
	}
</style>

