import Atom from './Atom.svelte';

const app = new Atom({
	target: document.getElementById('gv-atom'),
	props: {
		name: 'world'
	}
});

export default app;