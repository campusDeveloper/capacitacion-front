 <template>
	<ModalRight ref="refModalManageTrackingState" :title="`${isAdd ? 'Crear' : 'Editar'} estado de seguimiento`"
		destroyOnClose>
		<p class="f-t-14">Agrega un titulo y un color para {{ isAdd ? 'crear' : 'editar' }} el estado</p>
		<Form ref="refFormState" :initial-values="form" @submit="handleSubmit">
			<Field v-slot="{ field, errorMessage }" name="name" label="titulo" rules="required|max:40">
				<p class="f-tm-14 mt-5 pb-1">Titulo</p>
				<el-input :model-value="form.name" placeholder="Agregar titulo" size="large" maxlength="40"
					show-word-limit @update:model-value="handleNameChange($event, field.onChange)" @blur="field.onBlur" />
				<Error :local="errorMessage" server="name" />
			</Field>
			<div class="d-middle-center gap-x-4 my-5">
				<div class="inline-flex items-center rounded-lg h-9 border f-t-14 px-2 whitespace-nowrap transition-all"
					:style="{
						borderColor: form.color,
						color: form.color,
						minWidth: '84px',
						maxWidth: '300px'
					}">
					{{ form.name }}
				</div>
				<popoverPickerColor v-model="form.color" />
			</div>
		</Form>
		<template v-if="isAdd">
			<p class="text-black-300 f-t-14">Agrega los estados de seguimiento asignando un titulo y un color a cada uno.</p>
			<template v-for="(value, index) in subList" :key="index">
				<div class="d-middle text-mid-gray-300 gap-x-3 my-4 min-h-9">
					<div class="d-middle-center rounded-lg h-[34px] w-[116px] border f-t-14 px-2"
						:style="{ borderColor: value.color, color: value.color }">
						{{ value.name }}
					</div>
					<i class="icon-trash text-lg cursor-pointer" @click="removeContent(index)"></i>
				</div>
			</template>
			<Form ref="refFormTitles" @submit="addContent">
				<div class="d-middle gap-x-3">
					<Field name="titleName" rules="required|max:40" v-slot="{ field, errorMessage }">
						<div>
							<el-input :model-value="subFormValues.name" placeholder="Agregar titulo" class="!w-[222px]"
								maxlength="40" show-word-limit
								@update:model-value="handleSubNameChange($event, field.onChange)" @blur="field.onBlur" />
							<Error :local="errorMessage" server="name" />
						</div>
					</Field>
					<Field name="titleColor" rules="required" v-slot="{ field, errorMessage }">
						<div>
							<popoverPickerColor :model-value="subFormValues.color"
								@update:model-value="handleSubColorChange($event, field.onChange)" />
							<Error :local="errorMessage" server="color" />
						</div>
					</Field>

					<Button type-style="tertiary" type="submit">
						Agregar
					</Button>
				</div>
			</Form>
		</template>
		<template #footer>
			<div class="d-middle-end gap-x-2">
				<Button type="button" type-style="secondary" @click="close" class="min-w-[108px]">Cancelar</Button>
				<Button type="button" type-style="primary" @click="handleSubmit" :disabled="saving" class="min-w-[112px]">
					{{ isAdd ? 'Crear' : 'Guardar' }}
				</Button>
			</div>
		</template>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { Field, Form } from 'vee-validate';
import popoverPickerColor from '../components/popoverPickerColor.vue';
import { request } from '@request'
import * as Service from '../services/trackingService';

const emit = defineEmits(['update']);

const refModalManageTrackingState = ref();
const refFormState = ref();
const refFormTitles = ref();
const isAdd = ref(true);
const isEdit = ref(null);
const saving = ref(false);
const form = ref({
	name: '',
	color: null,
});

const subList = ref([]);
const subFormValues = ref({
	name: '',
	color: null,
});

function handleNameChange(value, onChange) {
	form.value.name = value;
	onChange(value);
}

function handleSubNameChange(value, onChange) {
	subFormValues.value.name = value;
	onChange(value);
}

function handleSubColorChange(value, onChange) {
	subFormValues.value.color = value;
	onChange(value);
}

async function handleSubmit() {
	if (saving.value || !refFormState.value) return;

	const { valid } = await refFormState.value.validate();
	if (!valid || !form.value.color) return;

	saving.value = true;
	try {
		const payload = {
			name: form.value.name,
			color: form.value.color,
			...(isAdd.value
				? {
					sub: subList.value.map((item) => ({
						name: item.name,
						color: item.color,
					})),
				}
				: {}),
		};

		if (isAdd.value) {
			const { error } = await request(() => Service.createTrackingOpportunity(payload));
			if (error) throw error;
		} else {
			const { error } = await request(() => Service.updateTrackingOpportunity(isEdit.value, payload));
			if (error) throw error;
		}

		close();
		emit('update');
	} catch (error) {
		console.error('Error saving tracking state:', error);
	} finally {
		saving.value = false;
	}
}

async function addContent() {
	if (!refFormTitles.value) return;

	const { valid } = await refFormTitles.value.validate();
	if (!valid) return;

	subList.value.push({
		name: subFormValues.value.name,
		color: subFormValues.value.color,
	});

	resetSubForm();
}

function openEdit(data = {}) {
	isAdd.value = false;
	isEdit.value = data.id || null;
	subList.value = [];
	form.value.name = data.name || '';
	form.value.color = data.color || null;
	saving.value = false;
	refModalManageTrackingState.value.open();
}

function removeContent(index) {
	subList.value.splice(index, 1);
}

function open() {
	subList.value = [];
	isAdd.value = true;
	isEdit.value = null;
	form.value.name = '';
	form.value.color = null;
	saving.value = false;
	resetSubForm();
	refModalManageTrackingState.value.open();
}

function close() {
	refModalManageTrackingState.value.close();
}

function resetSubForm() {
	subFormValues.value.name = '';
	subFormValues.value.color = null;
	if (refFormTitles.value) {
		refFormTitles.value.resetForm();
	}
}

defineExpose({
	open,
	close,
	openEdit,
});
</script>