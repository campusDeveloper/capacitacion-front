<template>
	<ModalRight ref="refModalCreateTemplate" title="Crear plantilla" width="465" destroyOnClose>
		<Form ref="refFormManage" :initial-values="initialValues" v-slot="{ values, setFieldValue }">
			<!-- CODE -->
			<p class="f-tm-14 mt-5 pb-1">Título</p>
			<Field name="code" rules="required|templateCode" v-slot="{ field, errorMessage }">
				<el-input :model-value="field.value" @update:model-value="field.onChange" @blur="field.onBlur"
					placeholder="Agrega un título" size="large" maxlength="255" show-word-limit />
				<p v-if="errorMessage" class="text-red-500 text-xs mt-1">
					{{ errorMessage }}
				</p>
			</Field>
			<!-- DESCRIPTION -->
			<p class="f-tm-14 mt-5 pb-1">Descripción</p>
			<Field name="description" rules="required|trimmed" v-slot="{ field, errorMessage }">
				<el-input type="textarea" :model-value="field.value" @update:model-value="field.onChange"
					@blur="field.onBlur" :autosize="{ minRows: 4, maxRows: 4 }" maxlength="65535" show-word-limit />
				<p v-if="errorMessage" class="text-red-500 text-xs mt-1">
					{{ errorMessage }}
				</p>
			</Field>
			<!-- CHECKBOXES -->
			<div class="d-middle gap-x-6 my-3">
				<Field name="addBtn" type="checkbox" v-slot="{ value, handleChange }">
					<el-checkbox :model-value="value" @change="handleChange">
						Agregar botón
					</el-checkbox>
				</Field>
				<Field name="addImg" type="checkbox" v-slot="{ value, handleChange }">
					<el-checkbox :model-value="value" @change="handleChange">
						Agregar imagen
					</el-checkbox>
				</Field>
			</div>
			<!-- BOTÓN -->
			<template v-if="values?.addBtn">
				<Field name="buttonType" rules="required" v-slot="{ value, errorMessage }">
					<el-radio-group :model-value="value" @change="onButtonTypeChange($event, setFieldValue)">
						<el-radio :value="1">Número teléfono</el-radio>
						<el-radio :value="2">URL</el-radio>
					</el-radio-group>
					<p v-if="errorMessage" class="text-red-500 text-xs mt-1">
						{{ errorMessage }}
					</p>
				</Field>
				<p class="f-tm-14 mt-5 pb-1">Título</p>
				<Field name="buttonText" rules="required" v-slot="{ field, errorMessage }">
					<el-input :model-value="field.value" @update:model-value="field.onChange"
						placeholder="Agregar título" />
					<p v-if="errorMessage" class="text-red-500 text-xs mt-1">
						{{ errorMessage }}
					</p>
				</Field>
				<!-- Si es Botón URL -->
				<template v-if="values?.addBtn && values?.buttonType == 2">
					<p class="f-tm-14 mt-5 pb-1">URL</p>
					<Field name="buttonValue" rules="required|url" v-slot="{ field, errorMessage }">
						<el-input :model-value="field.value" @update:model-value="field.onChange"
							placeholder="Agregar URL" />
						<p v-if="errorMessage" class="text-red-500 text-xs mt-1">
							{{ errorMessage }}
						</p>
					</Field>
				</template>
				<!-- Si es Botón Numero de telefono -->
				<template v-else>
					<p class="f-tm-14 mt-5 pb-1">Número teléfono</p>
					<Field name="buttonValue" rules="required|phone" v-slot="{ field, errorMessage }">
						<el-input :model-value="field.value" @update:model-value="field.onChange"
							placeholder="Agregar número de teléfono" maxlength="12" inputmode="numeric"
							pattern="[0-9]*">
							<template #prefix>
								<span class="text-gray-500">+</span>
							</template>
						</el-input>
						<p v-if="errorMessage" class="text-red-500 text-xs mt-1">
							{{ errorMessage }}
						</p>
					</Field>
				</template>
			</template>
			<!-- IMAGEN -->
			<Field v-if="values?.addImg" name="foto" rules="required|imageLimit"
				v-slot="{ field, errorMessage, handleChange }">
				<p class="f-tm-14 mt-5 pb-1">Imagen</p>
				<DragAndDropUpload :model-Value="field.value" @update:model-Value="field.onChange"
					accept=".png,.jpg,.jpeg" />
				<p v-if="errorMessage" class="text-red-500 text-xs mt-1">
					{{ errorMessage }}
				</p>
			</Field>
		</Form>
		<template #footer>
			<div class="d-middle-end gap-x-2">
				<Button type-style="secondary" class="min-w-[93px]" @click="close">Cancelar</Button>
				<Button class="min-w-[93px]" @click="onCreateTemplate">Crear </Button>
			</div>
		</template>
	</ModalRight>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { Form, Field, defineRule } from 'vee-validate';
import DragAndDropUpload from '@comp/DragAndDropUpload.vue';
import { request } from '@request';

const refModalCreateTemplate = ref()
const refFormManage = ref()
const initialValues = {
	code: "",
	description: "",
	addBtn: false,
	addImg: false,
	buttonType: 1,
	buttonText: "",
	buttonValue: "",
	foto: null
}

const onButtonTypeChange = (value, setFieldValue) => {
	setFieldValue('buttonType', value)
	setFieldValue('buttonText', '')
	setFieldValue('buttonValue', '')
}

async function open() {
	refModalCreateTemplate.value.open()
}


function close() {
	refModalCreateTemplate.value.close()
}

defineExpose({
	open
})
</script>
