<template>
	<modal ref="refModal" title="Foto del estudiante" width="min(575px, 85%)" :btnConfirm="false" :btnCancel="false">
		<div class="w-80 mx-auto vstack pb-10">
			<img :src="photo" @error="photo = '/img/trash/woUser.jpg'" alt="" class="wf-300 hf-300 rounded-full border">
			<p class="f-36 f-bold mt-10 lh-43 text-grey-dark text-center">{{ name }}</p>
		</div>
	</modal>
</template>

<script setup>
import { ref } from 'vue';

const refModal = ref()
const photo = ref()
const name = ref()

function open({ nombre, foto }) {
	photo.value = foto
	name.value = nombre
	refModal.value.open()
}

defineExpose({
	open
})
</script>

<style lang="scss" scoped>
.lh-43{
	line-height: 43px;
}
</style>