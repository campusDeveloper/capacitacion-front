<template>
	<div
		v-if="show"
		class="fixed top-0 left-0 w-screen h-screen bg-black-600/80 overflow-hidden backdrop-blur-sm"
		style="z-index: 9999;"
	>
		<div class="w-full h-full overflow-auto">
			<div class="flex items-center justify-between absolute bg-black-900/80 -top-[2px] w-full h-14 px-6 z-10 backdrop-blur-sm">
				<i class="icon-close text-gray-constants-white text-xl cursor-pointer z-10" @click.stop="close" />
				<div class="d-middle-center">
					<i v-if="downloadable" class="icon-download text-gray-constants-white text-xl cursor-pointer z-10" @click.stop="handleDownload" />
				</div>
			</div>
			<div class="flex justify-center flex-col items-center pt-20 pb-16 gap-y-10 min-w-full w-fit px-20">
				<VuePDF v-for="(page, index) in pages" :key="index" :pdf="pdf" :page="page" :scale="scale" :text-layer="textLayer" />
			</div>
			<div class="absolute d-middle-center rounded-full bottom-3 left-1/2 -translate-x-1/2 bg-black-900/80 backdrop-blur-sm select-none z-10 px-4 gap-x-4">
				<p class="text-gray-constants-white text-4xl mb-1 cursor-pointer" @click.stop="handleScale(-.25)">-</p>
				<i class="icon-search text-gray-constants-white text-2xl" />
				<p class="text-gray-constants-white text-4xl cursor-pointer" @click.stop="handleScale(.25)">+</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const props = defineProps({
	route: {
		type: String,
		default: ''
	},
	textLayer: {
		type: Boolean,
		default: false
	},
	downloadable: {
		type: Boolean,
		default: false
	}
})

const currentRoute = ref(props.route)
const show = ref(false)
const scale = ref(1)

const { pdf, pages, download } = usePDF(currentRoute)

watch(() => props.route, (newValue) => {
	currentRoute.value = newValue
})

function open(pdfRoute) {
	currentRoute.value = pdfRoute
	scale.value = 1
	show.value = true
};
function close() {
	show.value = false
};
function handleDownload() {
	download('Documento')
};
function handleScale(value) {
	if (scale.value === 0.25 && value < 0) return
	scale.value += value
};

defineExpose({
	open,
	close
})

</script>

<style lang="scss" scoped>
</style>
