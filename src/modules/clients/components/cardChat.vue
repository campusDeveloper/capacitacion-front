<template>
	<div :class="cardClasses">
		<p>{{ message }}</p>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props  = defineProps({
	identify: {
		type: Boolean,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	type: {
		type: Number,
		default: null
	}
})

const cardClasses = computed(() => [
	'min-h-[34px] f-t-14 p-3',
	props.identify
		? 'rounded-e-2xl rounded-b-2xl bg-white-50 text-mid-gray-600'
		: props.type === 3
			? 'rounded-s-2xl rounded-b-2xl bg-brand-300 ms-auto text-white-400'
			: 'rounded-s-2xl rounded-b-2xl bg-blue-s-500 ms-auto text-white-400'
])

</script>
