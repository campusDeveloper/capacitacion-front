<template>
	<el-popover placement="bottom" :popper-class="['custom-popover', classPopover]" trigger="click"
		transition="el-zoom-in-top" @before-leave="hidePopover">
		<template #reference>
			<div class="group d-middle-bt cursor-pointer h-[29px] ps-4 rounded-lg"
				:style="`${ isOutline ? 'border: 1px solid ' + optionsSelected.color : 'background-color:' + optionsSelected.color } !important; color: ${isOutline ? '': 'rgb(var(--xx-color-white-100))'}`">
				<p class="f-t-14">{{ optionsSelected.name ?? 'Sin estado' }}</p>
				<i
					class="icon-arrow-right group-aria-[describedby]:rotate-90 transition-all duration-150 ease-linear text-lg" />
			</div>
		</template>
		<template #default>
			<el-popover v-for="option in options" :key="option.idTracking" placement="right"
				popper-class="custom-popover" trigger="click" transition="el-zoom-in-top"
				:disabled="!option.children.length" :visible="subVisible === option.idTracking">
				<div v-for="child in option.children" :key="child.idTrackingChildren"
					class="group d-middle-bt cursor-pointer rounded-lg mb-2 h-[26px] px-2"
					:style="`${ isOutline ? 'border: 1px solid ' + child.color : 'background-color:' + child.color } !important; color: ${isOutline ? '': 'rgb(var(--xx-color-white-100))'}`" @click="handleSelectOption(child)">
					<p class="f-t-12">{{ child.name }}</p>
				</div>
				<template #reference>
					<div class="group d-middle-bt cursor-pointer ps-3 h-[26px] rounded-lg mb-2"
						:style="`${ isOutline ? 'border: 1px solid ' + option.color : 'background-color:' + option.color } !important; color: ${isOutline ? '': 'rgb(var(--xx-color-white-100))'}`" @click="openSubOptions(option)">
						<p class="f-t-12">{{ option.name }}</p>
						<i v-if="option.children.length"
							class="icon-arrow-right group-aria-[describedby]:rotate-90 transition-all text-lg duration-150 ease-linear" />
					</div>
				</template>
			</el-popover>
		</template>
	</el-popover>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const subVisible = ref(null)
const optionsSelected = ref({})

const props = defineProps({
	modelValue: {
		type: Number,
	},
	options: {
		type: Array,
		required: true
	},
	placement: {
		default: 'right'
	},
	isOutline: {
		type: Boolean,
		default: false
	},
	classPopover: {
		default: '!w-[267px]'
	}
})

const emit = defineEmits(['update:modelValue', 'change'])

const idOpportunityTracking = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('change', value)
		emit('update:modelValue', value)
	}
})

watch(() => idOpportunityTracking.value,
	() => {
		const filtered = props.options.map(item => {
			const hijo = item.children.find(child => child.idTrackingChildren == idOpportunityTracking.value)

			if (hijo)
				return {
					name: item.name,
					color: hijo.color,
					childrenName: hijo.name
				}

			if (item.idTracking == idOpportunityTracking.value)
				return {
					name: item.name,
					color: item.color,
					childrenName: null
				}
		})

		const selected = filtered.find(fo => typeof fo !== "undefined")

		if (!selected) {
			optionsSelected.value = {
				name: "No selecionado",
				color: "gray",
			}
			return
		}

		optionsSelected.value = {
			name: `${selected.name} / ${selected?.childrenName ?? "-"}`,
			color: selected.color,
		}
	},
	{
		immediate: true
	}
)

/* Functions */
function hidePopover() {
	subVisible.value = null
}

function openSubOptions(item) {
	subVisible.value = item.idTracking
}

function handleSelectOption(option) {
	subVisible.value = null
	idOpportunityTracking.value = option.idTrackingChildren
}

</script>
