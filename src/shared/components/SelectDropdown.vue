<template>
	<el-select
		v-model="idSelect"
		placeholder="No selecionado"
		:class="`${isOutline ? 'custom-select-outline' : ''} custom-select`"
		size="small"
		:placement="placement"
		popper-class="!max-w-[148px]"
		:style="computedStyle"
	>
		<el-option
			v-for="item in options"
			:key="item.id"
			:label="item.name"
			:value="item.id"
			class="d-middle !mb-1 !h-[26px]"
			:style="`${ isOutline ? 'border: 1px solid ' + item.color : 'background-color:' + item.color } !important; color: ${isOutline ? '': 'rgb(var(--xx-color-white-100))'}`"
		>
			<p class="line-clamp-1">{{ item.name }}</p>
		</el-option>
	</el-select>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	modelValue: {
		required: true
	},
	options: {
		required: true,
		type: Array
	},
	placement: {
		default: 'right'
	},
	isOutline: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:modelValue', 'change'])

const idSelect = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('change', value)
		emit('update:modelValue', value)
	}
})

const computedStyle = computed(() => {
	const selectedOption = props.options.find(x => x.id == idSelect.value)
	const colorBg = selectedOption?.color ?? 'transparent'
	const colorContentLight = selectedOption ? 'rgb(var(--xx-color-white-400))' : ''

	return `--color-bg: ${colorBg}; --color-content-light: ${colorContentLight};`
})

</script>