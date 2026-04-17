<template>
	<div class="d-middle-center w-full h-full">
		<div class="vstack items-center gap-y-2 w-[225px]">
			<img :src="imgUrl" alt="" :width="whImg" :height="whImg">
			<p class="text-mid-gray-600 f-ts-18">{{ data.title }}</p>
			<p class="text-black-300 f-tm-12 text-center">{{ data.description }}</p>
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	data: {
		type: Object,
		default: {
			title: 'Sin plantillas',
			description: 'Haz click en el botón “Crear plantilla” para iniciar'
		}
	},
	imgUrl: {
		type: String,
		default: '/img/illustrations/chatbot.svg'
	},
	whImg: {
		type: String,
		default: '198'
	}
})

</script>