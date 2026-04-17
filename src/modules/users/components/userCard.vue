<template>
	<div :class="['d-middle rounded-lg cursor-pointer text-[rgb(var(--xx-color-text-primary))] gap-x-4 p-4 w-[390px] min-h-[129px] transition-all ease-linear duration-100',
		!data.state ? 'hover:bg-light-gray-100 bg-light-gray-50' : 'hover:bg-white-300 bg-white-50']"
		style="box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
		<!-- Tooltip de pago -->
		<el-tooltip v-if="data.paymentAgent === 1" content="Agente de pago" placement="top">
			<i class="self-start icon-dollar-circle text-green-s-500" />
		</el-tooltip>
		<!-- Tooltip de agente especializado -->
		<el-tooltip v-if="data.specialAgent === 1" content="Agente especializado" placement="top">
			<i class="self-start icon-magic-star text-brand-500" />
		</el-tooltip>
		<div class="vstack self-start gap-y-1 w-full">
			<p class="f-tm-14">{{ data.name }}</p>
			<p class="f-tl-12">{{ data.type == 1 ? 'Administrador' : 'Comercial' }}</p>
			<p class="f-tl-12">{{ data.headquarter }} (+{{ data.countHeadquarters }})</p>
			<p class="f-tl-12">{{ data.email }}</p>
		</div>
		<div class="d-middle-center gap-1 mb-auto">
			<el-switch v-model="data.state" size="small" :active-value="1" :inactive-value="0"
				:before-change="() => handleChangeState(data)" />
			<DropdownOptions :options="options" :params="data"
				size-icon="text-[rgb(var(--xx-color-text-primary))] text-xl" placement="right" />
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	data: {
		default: {}
	}
})

const options = [
	{ option: 'Editar', action: openEdit, icon: 'icon-edit-2' },
	{ option: 'Eliminar', action: openDelete, icon: 'icon-trash', danger: true },
	{ option: 'Editar sedes', action: openEditSedes, icon: 'icon-buildings-2' },
]

const emit = defineEmits(['openEdit', 'onDelete', 'openDelete', 'onLink', 'handleChangeState', 'openEditSedes']);

function openEdit() {
	emit('openEdit', props.data)
}

function openDelete() {
	emit('openDelete', props.data)
}

function handleChangeState(data) {
	emit('handleChangeState', data)
	return false
}

function openEditSedes() {
	emit('openEditSedes', props.data)
}

</script>