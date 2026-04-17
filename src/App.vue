<template>
	<component :is="layout" key="layout-main" />
</template>

<script setup>
import { computed, defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

const empty = defineAsyncComponent(() => import('./shared/layouts/empty.vue'));
const base = defineAsyncComponent(() => import('./shared/layouts/base.vue'));

const layouts = {
	'empty': empty,
	'base': base,
};

const route = useRoute();

const layout = computed(() => {
	if (route?.name && route?.meta?.layout) return layouts[route.meta.layout];
	else return null;
});


watch(route, () => {
	if (route.meta?.title) {
		document.title = 'capacitacion - ' + (route?.meta?.title || '');
	} else {
		document.title = 'capacitacion';
	}
}, {
	immediate: true,
	deep: true,
});

</script>

<style lang="scss">
@import '@/assets/styles/tailwind.scss';
</style>
