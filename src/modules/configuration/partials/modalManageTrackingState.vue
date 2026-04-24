 <template>
	<ModalRight ref="refModalManageTrackingState" :title="`${isAdd ? 'Crear' : 'Editar'} estado de seguimiento`"
		destroyOnClose>
		<p class="f-t-14">Agrega un título y un color para {{ isAdd ? 'crear' : 'editar' }} el estado </p>
		<Form ref="refFormState" :initial-values="form">
			<Field v-slot="{ field, errorMessage }" name="name" label="título" rules="required|max:40">
				<p class="f-tm-14 mt-5 pb-1">Título</p>
				<el-input v-model="form.name" placeholder="Agregar título" size="large" maxlength="40" show-word-limit
					v-bind="field" />
				<Error :local="errorMessage" server="name" v-bind="field" />
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
			<p class="text-black-300 f-t-14">Agrega los estados de seguimiento asignando un título y un color a cada
				uno.</p>
			<template v-for="(value, index) in subList" :key="index">
				<div class="d-middle text-mid-gray-300 gap-x-3 my-4 min-h-9">
					<div class="d-middle-center rounded-lg h-[34px] w-[116px] border f-t-14 px-2"
						:style="{ borderColor: value.color, color: value.color }">
						{{ value.name }}
					</div>
					<i class="icon-trash text-lg cursor-pointer"  />
				</div>
			</template>
			<Form ref="refFormTitles" @submit="addContent">
				<div class="d-middle gap-x-3">
					<!-- NAME -->
					<Field name="name" rules="required|max:40" v-slot="{ field, errorMessage }">
						<div>
							<el-input :model-value="field.value" @update:model-value="field.onChange"
								placeholder="Agregar título" class="!w-[222px]" maxlength="40" show-word-limit />
							<Error :local="errorMessage" server="name" />
						</div>
					</Field>
					<!-- COLOR -->
					<Field name="color" rules="required" v-slot="{ field, errorMessage }">
						<div>
							<popoverPickerColor :model-value="field.value" @update:model-value="field.onChange" />
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
				<Button type-style="secondary" @click="close" class="min-w-[108px]">Cancelar </Button>
				<Button class="min-w-[112px]" >
					{{ isAdd == 1 ? 'Agregar' : 'Guardar' }}</Button>
			</div>
		</template>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { Field, Form, useForm } from 'vee-validate'
import popoverPickerColor from '../components/popoverPickerColor.vue';
import { request } from '../../../services/http'
import { fi } from 'element-plus/es/locales.mjs';

const refModalManageTrackingState = ref()
const refFormState = ref()
const refFormTitles = ref()
const isAdd = ref(true)
const isEdit = ref(null)
const idAdded = ref(false)
const form = ref({
	name: '',
	color: null,
})

const subList = ref([]);

async function addContent() {

}


function removeContent(index) {
	subList.value.splice(index, 1)
}

function open() {
	refModalManageTrackingState.value.open()
}

function openEdit(data = {}) {
	
	refModalManageTrackingState.value.open()
}

function close() {
	refModalManageTrackingState.value.close()
}

defineExpose({
	open,
	close,
	openEdit,
});

</script>