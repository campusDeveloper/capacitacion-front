<template>
	<el-popover
		popper-class="!w-[220px] !p-0" trigger="click"
		placement="bottom" popper-style="background: rgb(var(--xx-color-gray-constants-white)) !important;"
	>
		<template #reference>
			<Button type-style="tertiary" type="button" class="!px-0">
				<i class="icon-colorfilter !text-xl"/>
			</Button>
		</template>
		<div class="d-middle-center">
			<ColorPicker v-model="color" />
		</div>
	</el-popover>
</template>

<script setup>
import { computed } from 'vue';
import ColorPicker from '@comp/ColorPicker.vue'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
});

const emit = defineEmits(['update:modelValue']);

const color = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	}
});

</script>