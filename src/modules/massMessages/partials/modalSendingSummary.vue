<template>
	<Modal ref="refModalSendingSummary" title="Resumen de envío" width="686" :footer="false">
		<div class="d-middle-bt">
			<div
				class="vstack items-center justify-center text-mid-gray-600 bg-white-200 p-4 w-[200px] rounded-3xl min-h-[124px]">
				<p class="!text-[32px] f-semibold">{{ model.total }}</p>
				<p class="f-t-20">Total</p>
			</div>
			<div
				class="vstack items-center justify-center text-green-s-700 bg-green-s-50 p-4 w-[200px] rounded-3xl min-h-[124px]">
				<p class="!text-[32px] f-semibold">{{ model.successful }}</p>
				<p class="f-t-20">Exitosos</p>
			</div>
			<div
				class="vstack items-center justify-center text-red-s-600 bg-red-s-50 p-4 w-[200px] rounded-3xl min-h-[124px]">
				<p class="!text-[32px] f-semibold">{{ model.failed }}</p>
				<p class="f-t-20">Fallidos</p>
			</div>
		</div>
		<div class="vstack justify-center bg-white-200 rounded-3xl p-4 my-6 min-h-[128px]">
			<p class="text-mid-gray-600 f-ts-20">Tasa de envío</p>
			<div class="d-middle gap-x-4">
				<el-progress type="line" :percentage="model.successRate" status="success" class="w-full"
					:show-text="false" :stroke-width="12" :color="setColorBar(model.successRate)" />
				<p class="f-medium !text-[24px]">{{ model.successRate }}%</p>
			</div>
		</div>
	</Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { request } from "@request";

const refModalSendingSummary = ref()
const idTemplateSend = ref(null);

const model = ref({
	total: 0,
	successful: 0,
	failed: 0,
	successRate: 0
})

function setColorBar(percentage) {
	if (percentage < 50) return 'rgb(var(--xx-color-red-semantic-500))'
	else if (percentage > 49 && percentage < 80) return 'rgb(var(--xx-color-yellow-semantic-500))'
	else return 'rgb(var(--xx-color-green-semantic-500))'
}

async function open() {
	refModalSendingSummary.value.open();
}

defineExpose({
	open
})

</script>