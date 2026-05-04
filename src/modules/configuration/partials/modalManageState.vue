<template>
	<ModalRight ref="refModalManageState"
		:title="`${isAdd ? 'Crear' : 'Editar'} ${isClientType ? 'tipo de cliente' : 'estado de interes'}`"
		destroyOnClose>
		<p class="f-t-14">Agrega un titulo y un color para {{ isClientType ? 'la etiqueta' : 'crear/actualizar el estado'
			}} </p>
		<Form ref="refFormState" :initial-values="form">
			<Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="name" label="titulo"
				rules="required|max:40">
				<p class="f-tm-14 mt-5 pb-1">Titulo</p>
				<el-input :model-value="form.name" :name="field.name" placeholder="Agrega un titulo" size="large"
					@update:model-value="(value) => handleNameChange(value, handleChange)" @blur="handleBlur" />
				<Error :local="errorMessage" server="name" :value="form.name" />
			</Field>
			<Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="description" label="descripcion"
				:rules="`required|max:${descriptionMaxLength}`">
				<p class="f-tm-14 mt-5 pb-1">Descripcion</p>
				<el-input type="textarea" :model-value="form.description" :name="field.name"
					placeholder="Agrega una descripcion" :autosize="{ minRows: 4, maxRows: 4 }"
					:maxlength="descriptionMaxLength" show-word-limit
					@update:model-value="(value) => handleDescriptionChange(value, handleChange)" @blur="handleBlur" />
				<Error :local="errorMessage" server="description" :value="form.description" />
			</Field>
			<div class="d-middle-center rounded-lg h-[29px] w-[64px] mx-auto mt-5 text-white-100 f-t-14"
				:style="{ backgroundColor: form.color }">
				Estado
			</div>
			<Field v-slot="{ field, errorMessage, handleChange }" name="color" label="color" rules="required">
				<div class="d-middle-center">
					<ColorPicker :model-value="form.color" :name="field.name"
						@update:model-value="(value) => handleColorChange(value, handleChange)" />
				</div>
				<Error :local="errorMessage" server="color" :value="form.color" />
			</Field>
		</Form>
		<template #footer>
			<div class="d-middle-end gap-x-2">
				<Button type-style="secondary" @click="close" class="min-w-[108px]">Cancelar </Button>
				<Button class="min-w-[112px]" @click="handleInterestState">
					{{ isAdd == 1 ? 'Agregar' : 'Guardar' }}</Button>
			</div>
		</template>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import { Field, Form } from 'vee-validate'
import ColorPicker from '@comp/ColorPicker.vue'
import { request } from '../../../services/http'
import * as Service from '../services/oportunityService'

const refModalManageState = ref()
const refFormState = ref()
const emit = defineEmits(['update'])

const descriptionMaxLength = 200
const isAdd = ref(true)
const isClientType = ref(false)
const idState = ref(null)
const hasShownDescriptionLimit = ref(false)
const form = ref({
	name: '',
	description: '',
	color: null,
	state: 1
})

function resetFormData() {
	idState.value = null
	form.value = {
		name: '',
		description: '',
		color: null,
		state: 1
	}
}

function handleDescriptionInput(value = '') {
	if (value.length >= descriptionMaxLength && !hasShownDescriptionLimit.value) {
		hasShownDescriptionLimit.value = true
		ElMessage.warning(`La descripcion no puede superar los ${descriptionMaxLength} caracteres.`)
		return
	}

	if (value.length < descriptionMaxLength) {
		hasShownDescriptionLimit.value = false
	}
}

function handleDescriptionChange(value, handleChange) {
	form.value.description = value
	handleChange(value)
	handleDescriptionInput(value)
}

function handleNameChange(value, handleChange) {
	form.value.name = value
	handleChange(value)
}

function handleColorChange(value, handleChange) {
	form.value.color = value
	handleChange(value)
}

async function handleInterestState() {
	const isValid = await refFormState.value?.validate()
	if (!isValid?.valid) return

	const payload = {
		name: form.value.name?.trim(),
		description: form.value.description?.trim() || null,
		color: form.value.color,
		state: form.value.state ?? 1,
	}

	const serviceCall = isAdd.value
		? () => Service.createOpportunityState(payload)
		: () => Service.updateOpportunityState(idState.value, payload)

	const { error } = await request(serviceCall)
	if (error) return

	emit('update')
	close()
}

function open(identify = false) {
	isAdd.value = true
	isClientType.value = identify
	hasShownDescriptionLimit.value = false
	refFormState.value?.resetForm()
	resetFormData()
	refModalManageState.value.open()
}

function openEdit(data = {}, identify = false) {
	isAdd.value = false
	isClientType.value = identify
	hasShownDescriptionLimit.value = false
	idState.value = data?.id ?? null
	form.value = {
		name: data?.name ?? '',
		description: data?.description ?? '',
		color: data?.color ?? null,
		state: data?.state ?? 1
	}
	refFormState.value?.resetForm({
		values: { ...form.value }
	})
	refModalManageState.value.open()
}

function close() {
	hasShownDescriptionLimit.value = false
	refFormState.value?.resetForm()
	resetFormData()
	refModalManageState.value.close()
}

defineExpose({
	open,
	close,
	openEdit,
});

</script>
