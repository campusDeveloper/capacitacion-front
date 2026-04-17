<template>
	<ModalRight ref="refModalManagePayment" title="Gestionar pago" width="400" destroyOnClose>
		<p class="f-tm-14">Confirmar pago</p>
		<el-radio-group v-model="confirmPay">
			<el-radio :value="1" size="large">
				<p class="text-gray-600 f-t-16">Sí</p>
			</el-radio>
			<el-radio :value="0" size="large">
				<p class="text-gray-600 f-t-16">No</p>
			</el-radio>
		</el-radio-group>
		<Form v-if="confirmPay === 1" ref="refFormPayment">
			<Field v-slot="{ field, errorMessage }" name="file" label="adjuntar" rules="required">
				<DragAndDropFile ref="refDragAndDrop" title="Adjunta el documento" buttonClass="!w-[110px] !text-[11px]"
					subDescription="Peso máximo 10MB" class="mt-8 w-full" v-model="formData.file"
					description="Archivos con formato .PDF" accept="application/pdf" v-bind="field" width="342" />
				<Error :local="errorMessage" server="nombre" v-bind="field" />
			</Field>
			<div v-if="formData.file?.name"
				class="d-middle min-h-[34px] bg-mid-gray-50 rounded-xl w-fit mt-2 px-3 gap-x-1">
				<p class="text-xs text-black-700">{{ formData.file.name }} </p>
				<i class="icon-close-circle text-black-300 cursor-pointer" @click="deleteFile" />
			</div>
			<Field v-slot="{ field, errorMessage }" name="date" label="fecha de soporte" rules="required">
				<div class="mt-4">
					<p class="f-tm-14 pb-1">Fecha de soporte</p>
					<el-date-picker v-model="formData.date" placeholder="Seleccionar" size="large" class="w-full"
						v-bind="field" />
					<Error :local="errorMessage" server="nombre" v-bind="field" />
				</div>
			</Field>
			<Field v-slot="{ field, errorMessage }" name="value" label="valor" rules="required">
				<div class="mt-4">
					<p class="f-tm-14 pb-1">Valor</p>
					<el-input type="number" v-model="formData.value" placeholder="Valor" size="large" class="w-full"
						v-bind="field" />
					<Error :local="errorMessage" server="nombre" v-bind="field" />
				</div>
			</Field>
		</Form>
		<div v-else class="mt-4">
			<p class="f-tm-14">Observaciones</p>
			<el-input v-model="observation" type="textarea" placeholder="Agrega una observación" />
		</div>
		<template #footer>
			<div class="d-middle-end gap-x-3">
				<Button type-style="secondary" @click="close" class="!w-[100px]">Cancelar</Button>
				<Button class="!w-[100px]" @click="saveData">Guardar</Button>
			</div>
		</template>
	</ModalRight>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { Form, Field } from 'vee-validate';
import DragAndDropFile from '@comp/DragAndDropFile.vue';

const refModalManagePayment = ref()
const refFormPayment = ref()
const refDragAndDrop = ref()

const confirmPay = ref(1)
const observation = ref('')

const formData = ref({
	file: null,
	date: null,
	value: null,
})

const emit = defineEmits(["submitData"])

/* Functions */
function deleteFile() {
	refDragAndDrop.value.deleteElement()
}


function open() {
	refModalManagePayment.value.open()
}

function close() {
	refModalManagePayment.value.close()
}

defineExpose({
	open,
	close
})

</script>