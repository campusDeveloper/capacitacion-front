<template>
	<div :class="[
		'min-h-[34px] f-t-14 p-3 cursor-pointer',
		identify === 1 ? 'rounded-e-2xl rounded-b-2xl' : 'rounded-s-2xl rounded-b-2xl ms-auto',
		type === 1 ? 'bg-white-50 text-mid-gray-600' : type === 3 ? 'bg-blue-500 text-white-400' : 'bg-green-s-100 text-mid-gray-600'
	]">
		<img v-if="isImage" :src="message" class="max-w-[180px] rounded-lg" @click="openViewer" />

		<video v-else-if="isVideo" :src="message" controls class="max-w-[220px] rounded-lg" />

		<div v-else-if="isPdf" class="flex items-center gap-2 text-white text-sm underline" @click="openViewer">
			📄 Ver documento PDF
		</div>

		<pre v-else class="text-[12px]">{{ message }}</pre>

		<div v-if="showViewer" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
			@click.self="closeViewer">
			<img v-if="isImage" :src="message" class="max-w-[90%] max-h-[90%] rounded-xl" />
			<iframe v-else-if="isPdf" :src="message" class="w-[90%] h-[90%] bg-white rounded-xl" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
	identify: { type: Number, default: 1 },
	message: { type: String, required: true },
	type: { type: Number, default: 1 }
})

const showViewer = ref(false)

const isImage = computed(() =>
	/\.(png|jpg|jpeg|gif|webp)$/i.test(props.message)
)

const isVideo = computed(() =>
	/\.(mp4|webm|ogg|mov)$/i.test(props.message)
)

const isPdf = computed(() =>
	/\.pdf$/i.test(props.message)
)

const openViewer = () => {
	showViewer.value = true
}

const closeViewer = () => {
	showViewer.value = false
}
</script>
