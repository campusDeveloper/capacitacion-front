<template>
	<Transition :name="route.meta?.transition ?? 'slide-fade'">
		<slot />
	</Transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
	name: {
		type: String,
		default: 'slide-fade'
	}
})

</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
	transition: all 0.3s ease-out;
	transition-delay: 0.1s;
}
.slide-fade-leave-active {
	transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
	transform: translateX(30px);
	opacity: 0;
}

.slide-top-enter-active {
	transition: all 0.3s ease-out;
}
.slide-top-leave-active {
	// transition: all 0.2s ease-out;
}

.slide-top-enter-from, .slide-top-leave-to {
	transform: translateY(-1000px);
	opacity: 0;
}
</style>