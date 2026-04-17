<template>
	<ModalRight ref="refModalManageState"
		:title="`${isAdd ? 'Crear' : 'Editar'} ${isClientType ? 'tipo de cliente' : 'estado de interés'}`"
		destroyOnClose>
		<p class="f-t-14">Agrega un título y un color para {{ isClientType ? 'la etiqueta' : 'crear/actualizar el estado'
			}} </p>
		<Form ref="refFormState" :initial-values="form">
			<Field v-slot="{ field, errorMessage }" name="name" label="título" rules="required|max:40">
				<p class="f-tm-14 mt-5 pb-1">Título</p>
				<el-input v-model="form.name" placeholder="Agrega un título" size="large" v-bind="field" />
				<Error :local="errorMessage" server="name" v-bind="field" />
			</Field>
			<p class="f-tm-14 mt-5 pb-1">Descripción</p>
			<el-input type="textarea" v-model="form.description" placeholder="Agrega una descripción"
				:autosize="{ minRows: 4, maxRows: 4 }" :maxlength="200" />
			<div class="d-middle-center rounded-lg h-[29px] w-[64px] mx-auto mt-5 text-white-100 f-t-14"
				:style="{ backgroundColor: form.color }">
				Estado
			</div>
			<Field v-slot="{ field, errorMessage }" name="color" label="color" rules="required">
				<div class="d-middle-center">
					<ColorPicker v-model="form.color" v-bind="field" />
				</div>
				<Error :local="errorMessage" server="color" v-bind="field" />
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
import { Field, Form } from 'vee-validate'
import ColorPicker from '@comp/ColorPicker.vue'
import { request } from '../../../services/http'

const refModalManageState = ref()
const refFormState = ref()

const isAdd = ref(true)
const isClientType = ref(false)
const form = ref({
	name: '',
	description: '',
	color: null,
	state: 1
})

/* Functions */
async function handleInterestState() {
	
}

function open(identify = false) {
	
	refModalManageState.value.open()
}

function openEdit(data = {}, identify = false) {
	
	refModalManageState.value.open()
}

function close() {
	refModalManageState.value.close()
}

defineExpose({
	open,
	close,
	openEdit,
});

</script>