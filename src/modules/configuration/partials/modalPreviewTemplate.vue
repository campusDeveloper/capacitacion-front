<template>
	<Modal ref="refModalPreviewTemplate" title="Vista previa de la plantilla" width="430" :footer="false">
		<div class="bg-[#ECE6E2] p-6">
			<div class="rounded-xl overflow-hidden bg-white-50 w-[253px]">
				<div class="vstack items-center p-3 min-h-[158px]">
					<img v-if="model.imageUrl" :src="model.imageUrl" alt="" class="w-[221px]">
					<p>{{ model.description }}</p>
				</div>
				<div v-if="model.buttonType && model.buttonText"
					class="d-middle-center h-[40px] gap-x-2 border-t border-white-500">
					<i :class="[
						'text-xl text-brand-500',
						model.buttonType === 1 ? 'icon-call' : 'icon-open-in-new'
					]" />
					<p class="text-brand-400 f-tm-14 cursor-pointer hover:underline">
						{{ model.buttonText }}
					</p>
				</div>
			</div>
		</div>
	</Modal>
</template>

<script setup>
import { ref } from 'vue';

const refModalPreviewTemplate = ref()

const model = ref({})

/* Functions */
function open() {
	refModalPreviewTemplate.value.open()
}

function close() {
	refModalPreviewTemplate.value.close()
}

defineExpose({
	open,
	close
})


</script>