<template>
	<ModalRight ref="refModalSeeTrackingStatus" title="Ver estado de seguimiento" destroyOnClose @close="onModalClose">
		<p class="f-t-14">Revisa los estados de seguimiento y ajustalos según tu pereferencia</p>
		
		<!-- Info del estado padre -->
		<div v-if="parentRow" class="d-middle gap-x-3 my-5 p-4 bg-brand-50 rounded-lg">
			<div class="d-middle-center rounded-lg h-[34px] w-[116px] border f-t-14 px-2"
				:style="{ borderColor: parentRow.color, color: parentRow.color }">
				{{ parentRow.name }}
			</div>
			<div class="text-sm text-mid-gray-600">
				<p><strong>Usos totales:</strong> {{ parentRow.uses }}</p>
				<p><strong>Estado:</strong> {{ parentRow.state === 1 ? 'Activo' : 'Inactivo' }}</p>
			</div>
		</div>

		<p class="f-tm-18 my-5 text-mid-gray-600">Estados hijos</p>
		
		<template v-if="dataOpportunityTrackingDetail.length > 0">
			<div v-for="(value, index) in dataOpportunityTrackingDetail" :key="value.id" class="d-middle text-mid-gray-300 gap-x-3 my-4 min-h-9">
				<div class="d-middle-center rounded-lg h-[34px] w-[116px] border f-t-14 px-2"
					:style="{ borderColor: value.color, color: value.color }">
					{{ value.name }}
				</div>
				<i class="icon-trash text-lg cursor-pointer" @click="openDeleteChild(value.id)" />
				<i class="icon-edit-2 text-lg cursor-pointer" @click="openEditChild(index)" />
				<el-tooltip content="Usos" placement="top">
					<div class="d-middle-end gap-x-1">
						<p class="text-black-300 f-tm-14">{{ value.uses }}</p>
						<i class="icon-mouse text-lg" />
					</div>
				</el-tooltip>
			</div>
			
			<!-- Formulario de edición -->
			<div v-if="isEdit !== null" class="d-middle gap-x-3 my-4 min-h-9">
				<el-input v-model="nameValue" placeholder="Agregar título" class="!w-[222px]" maxlength="40"
					show-word-limit />
				<Error :local="nameError" server="name" />
				<popoverPickerColor v-model="colorValue" />
				<Error :local="colorError" server="color" />
				<Button type-style="tertiary" @click="handleUpdateChild">Guardar</Button>
				<Button type-style="secondary" @click="cancelEdit">Cancelar</Button>
			</div>
			
			<!-- Formulario de agregar -->
			<Form ref="refFormTitles" @submit.prevent="addContent">
				<div class="d-middle gap-x-3 mt-5">
					<Field name="nameAdd" rules="required|max:40" v-slot="{ field, errorMessage }">
						<div>
							<el-input :model-value="field.value" @update:model-value="field.onChange"
								placeholder="Agregar título" class="!w-[222px]" maxlength="40" show-word-limit />
							<Error :local="errorMessage" server="name" />
						</div>
					</Field>
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
		</template>
		
		<template v-else>
			<p class="text-mid-gray-500 text-center my-8">No hay estados hijos registrados</p>
		</template>
	</ModalRight>
	
	<Modal ref="refModalDeleteTrackingStatus" type="danger" action="Eliminar" cancel="Cancelar" title="Eliminar estado"
		width="360" :onAction="handleDeleteTrackingStatus" @close="refModalDeleteTrackingStatus.value.close()">
		<p>¿Deseas eliminar este estado de seguimiento? <br /> Esta acción es irreversible</p>
	</Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Field, Form, useField, useForm } from 'vee-validate'
import popoverPickerColor from '../components/popoverPickerColor.vue';
import { getTrackingChildren, createTrackingChild, updateTrackingChild, deleteTrackingChild } from '../services/trackingService'; // A eliminar cuando se integre el servicio real

const emit = defineEmits(['update'])

const refModalSeeTrackingStatus = ref()
const refFormTitles = ref()
const dataOpportunityTrackingDetail = ref([]);
const loading = ref(false);
const parentRow = ref(null);

const isEdit = ref(null);
const currentEditId = ref(null);
const currentDeleteId = ref(null);
const refModalDeleteTrackingStatus = ref()

const { value: nameValue, errorMessage: nameError } = useField("name");
const { value: colorValue, errorMessage: colorError } = useField("color");

async function loadTrackingChildren(parentId) {
  loading.value = true;
  try {
    const response = await getTrackingChildren(parentId);
    if (response.data) {
      dataOpportunityTrackingDetail.value = response.data;
    }
  } catch (error) {
    console.error('Error loading tracking children:', error);
  } finally {
    loading.value = false;
  }
}

async function addContent() {
  if (!nameValue.value || !colorValue.value) {
    return;
  }
  
  try {
    const payload = {
      name: nameValue.value,
      color: colorValue.value,
      idOpportunityTracking: parentRow.value.id,
      state: 1
    };
    
    await createTrackingChild(payload);
    
    nameValue.value = '';
    colorValue.value = '';
    
    await loadTrackingChildren(parentRow.value.id);
    emit('update');
  } catch (error) {
    console.error('Error adding child state:', error);
  }
}

function openEditChild(index) {
	const child = dataOpportunityTrackingDetail.value[index];
	isEdit.value = index;
	currentEditId.value = child.id;
	nameValue.value = child.name;
	colorValue.value = child.color;
}

function cancelEdit() {
	isEdit.value = null;
	currentEditId.value = null;
	nameValue.value = '';
	colorValue.value = '';
}

async function handleUpdateChild() {
  if (!nameValue.value || !colorValue.value || !currentEditId.value) {
    return;
  }
  
  try {
    const payload = {
      name: nameValue.value,
      color: colorValue.value
    };
    
    await updateTrackingChild(currentEditId.value, payload);
    
    cancelEdit();
    await loadTrackingChildren(parentRow.value.id);
    emit('update');
  } catch (error) {
    console.error('Error updating child state:', error);
  }
}

function openDeleteChild(childId) {
	currentDeleteId.value = childId;
	refModalDeleteTrackingStatus.value.open();
}

async function handleDeleteTrackingStatus() {
  if (!currentDeleteId.value) return;
  
  await deleteTrackingChild(currentDeleteId.value);
  await loadTrackingChildren(parentRow.value.id);
  refModalDeleteTrackingStatus.value.close();
  emit('update');
}

async function open(row) {
	parentRow.value = row;
	isEdit.value = null;
	currentEditId.value = null;
	nameValue.value = '';
	colorValue.value = '';
	
	await loadTrackingChildren(row.id);
	refModalSeeTrackingStatus.value.open();
}

function onModalClose() {
	refModalSeeTrackingStatus.value.close();
}

defineExpose({
	open,
	close: onModalClose,
});

</script>