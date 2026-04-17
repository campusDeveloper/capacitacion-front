<template>
	<div :class="['min-h-[34px] f-t-14 p-3', identify ? 'rounded-e-2xl rounded-b-2xl bg-white-50 text-mid-gray-600': 'rounded-s-2xl rounded-b-2xl bg-blue-s-500 ms-auto text-white-400']">
		<pre :class="classPre">{{ message }}</pre>
	</div>
</template>

<script setup>

const props  = defineProps({
	identify: {
		type: Boolean,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	classPre: {
		type: String,
		default: ''
	}
})

</script>