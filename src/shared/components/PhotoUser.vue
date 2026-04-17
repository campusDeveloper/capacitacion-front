<template>
	<div :class="['relative', classPhoto]">
		<img :src="photo" alt="" class="w-full h-full rounded-full" @error="(e) => { e.target.src = '/img/trash/photo-empty.svg' }">
		<slot />
	</div>
</template>

<script setup>

const props = defineProps({
	photo: {
		type: String,
		default: ''
	},
	classPhoto: {
		type: String,
		default: '!size-[40px] rounded-full'
	}
})

</script>