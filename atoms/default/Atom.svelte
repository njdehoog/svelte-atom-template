<script>
	export let type;
</script>

<div class="atom">
	<h1>Hello atom!</h1>
	<p>This is an {type} atom!</p>
</div>

<style lang="scss">
	:global {
		@import "styles/atom-defaults.scss";
	}
</style>
