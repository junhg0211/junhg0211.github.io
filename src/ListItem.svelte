<script>
	export let name;
	export let href;
	export let description;
	export let date;
</script>

<li>
	<a {href}><strong>{name}</strong></a>{description ? " " + description : ""}: {date}
	<slot />
</li>
