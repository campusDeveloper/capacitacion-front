<template>
	<ModalRight ref="refModalSeeTrackingStatus" title="Ver estado de seguimiento" destroyOnClose @close="onModalClose">
		<p class="f-t-14">Revisa los estados de seguimiento y ajustalos según tu pereferencia</p>
		<p class="f-tm-18 my-5 text-mid-gray-600">{{ tituloPadre }}</p>
		<template v-for="(value, index) in dataOpportunityTrackingDetail" :key="index">
			<div v-if="isEdit == index" class="d-middle gap-x-3 my-4 min-h-9">
				<!-- NAME -->
				<el-input v-model="nameValue" placeholder="Agregar título" class="!w-[222px]" maxlength="40"
					show-word-limit />
				<Error :local="nameError" server="name" />
				<!-- COLOR -->
				<popoverPickerColor v-model="colorValue" />
				<Error :local="colorError" server="color" />
				<Button type-style="tertiary" type="button" >Guardar</Button>
			</div>
			<div v-else class="d-middle text-mid-gray-300 gap-x-3 my-4 min-h-9">
				<div class="d-middle-center rounded-lg h-[34px] w-[116px] border f-t-14 px-2"
					:style="{ borderColor: value.color, color: value.color }">
					{{ value.name }}
				</div>
				<i class="icon-trash text-lg cursor-pointer"  />
				<i class="icon-edit-2 text-lg cursor-pointer"  />
				<el-tooltip content="Usos" placement="top">
					<div class="d-middle-end gap-x-1">
						<p class="text-black-300 f-tm-14">{{ value.uses }}</p>
						<i class="icon-mouse text-lg" />
					</div>
				</el-tooltip>
			</div>
		</template>
		<Form ref="refFormTitles" @submit="addContent">
			<div class="d-middle gap-x-3">
				<!-- NAME -->
				<Field name="nameAdd" rules="required|max:40" v-slot="{ field, errorMessage }">
					<div>
						<el-input :model-value="field.value" @update:model-value="field.onChange"
							placeholder="Agregar título" class="!w-[222px]" maxlength="40" show-word-limit />
						<Error :local="errorMessage" server="name" />
					</div>
				</Field>
				<!-- COLOR -->
				<Field name="colorAdd" rules="required" v-slot="{ field, errorMessage }">
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
	</ModalRight>
	<Modal ref="refModalDeleteTrackingStatus" type="danger" action="Eliminar" cancel="Cancelar" title="Eliminar estado"
		width="360" :onAction="handleDeleteTrackingStatus">
		<p>¿Deseas eliminar este estado de seguimiento? <br /> Esta acción es irreversible</p>
	</Modal>
</template>

<script setup>
import { ref } from 'vue';
import { Field, Form, useField, useForm } from 'vee-validate'
import popoverPickerColor from '../components/popoverPickerColor.vue';
import { request } from '../../../services/http'

const refModalSeeTrackingStatus = ref()
const refFormTitles = ref()
const dataOpportunityTrackingDetail = ref([]);
const loading = ref(false);
const idPadre = ref(true);
const tituloPadre = ref(true);
const currentDeleteId = ref(null);
const refModalDeleteTrackingStatus = ref()
const isEdit = ref(null);
const { value: nameValue, errorMessage: nameError } = useField("name");
const { value: colorValue, errorMessage: colorError } = useField("color");

async function handleDeleteTrackingStatus() {
	
}

async function open() {
	refModalSeeTrackingStatus.value.open()
}

function onModalClose() {
	refModalSeeTrackingStatus.value.close()
}

defineExpose({
	open,
	close, onModalClose,
});

</script>