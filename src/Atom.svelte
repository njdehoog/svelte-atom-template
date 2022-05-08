<script>
	export let type;
</script>

<div class="atom">
	<h1>Hello atom!</h1>
	<p>This is an {type} atom</p>
</div>

<style lang="scss">
	@import "styles/atom-defaults.scss";

	h1 {
		font-size: 2em;
		color: #121212;
	}
</style>