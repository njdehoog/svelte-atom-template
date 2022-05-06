import Atom from './Atom.svelte';

const app = new Atom({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;