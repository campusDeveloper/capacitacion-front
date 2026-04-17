<template>
	<div class="d-middle bg-white-50 gap-x-4 p-4 w-[390px] rounded-lg text-mid-gray-600 cursor-pointer transition-all duration-150 ease-linear shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]
		border border-[transparent] hover:border-mid-gray-300 hover:bg-white-300
	">
		<img :src="data.foto" alt="" class="size-[120px]">
		<div class="vstack gap-y-2">
			<p class="f-ts-16">{{ data.nombre }}</p>
			<p class="f-t-12">{{ data.descripcion }}</p>
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

</script>