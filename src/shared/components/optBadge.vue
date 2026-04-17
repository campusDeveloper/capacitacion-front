<template>
    <div :class="`bg-green-s-300 ${ !number ? styles[size].wh + ' rounded-full' : (number > 9 ? 'min-w-[25px]' : 'h-[19px]') + ' opt-badge-p rounded-md h-fit'}`">
        <p v-if="number" :class="`f-inter f-bold text-surface-gray-primary ${styles[size].fontSize} `">{{ number }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	size: {
		type: String,
		default: 'large'
    },
	number: {
		type: [String, Number],
		default: null
    },
})

const styles = ref({
	small: {
		fontSize: 'text-xs',
		wh: 'size-[6px]',
	},
	large: {
		fontSize: 'text-[16px]',
		wh: 'size-[10px]',
	},
})
</script>

<style lang="scss" scoped>
.opt-badge-p{
	padding: 2px 5px 2px 5px;
}
</style>