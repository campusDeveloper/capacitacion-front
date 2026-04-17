<template>
	<color-picker
		v-model:pureColor="modela"
		pickerType="chrome"
		:isWidget="true"
		format="hex"
		disableHistory
		disableAlpha
	/>
</template>

<script setup>
import { computed } from 'vue';
import { ColorPicker} from 'vue3-colorpicker';
import "vue3-colorpicker/style.css";

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
});

const emit = defineEmits(['update:modelValue']);

const modela = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value)
});

</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
.vc-colorpicker {
	z-index: 0 !important;
	box-shadow: none !important;
	&.white {
		background-color: transparent !important;
	}
}
.vc-colorpicker-w-full{
	.vc-colorpicker{
		width: 100% !important;
	}
}
</style>