<template>
	<div class="d-middle bg-white-50 gap-x-5 px-10 border-b border-white-500 shadow-[0px_1px_2px_-1px_rgba(179,179,179,0.1),0px_1px_3px_0px_rgba(226,226,226,0.1)] min-h-[68px]">
		<i v-if="actionBack" class="icon-arrow-outline-left text-mid-gray-300 text-xl cursor-pointer" @click="actionBack"/>
		<p class="text-gray-constants-black me-auto f-ts-18">{{ name }}</p>
		<el-input v-if="showInput" v-model="search" placeholder="Buscar" class="relative !w-[250px]">
			<template #suffix>
				<Button type-style="tertiary" class="absolute right-0 !rounded-lg !p-0" @click="handleSearch">
					<i class="icon-search !text-xl"/>
				</Button>
			</template>
		</el-input>
		<Button v-if="actionBtn" class="!min-w-[146px]" @click="actionBtn">{{ contentBtn }}</Button>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: 'Section'
	},
	contentBtn: {
		type: String,
		default: 'Crear'
	},
	actionBack: {
		type: [Function, Boolean],
		default: false
	},
	actionBtn: {
		type: [Function, Boolean],
		default: false
	},
	showInput: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:modelValue', 'handleSearch'])

const search = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	}
})


/* Functions */
function handleSearch() {
	emit('handleSearch', search.value)
}

</script>