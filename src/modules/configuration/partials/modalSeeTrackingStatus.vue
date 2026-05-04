<template>
	<div>
		<ModalRight ref="refModalSeeTrackingStatus" title="Ver estado de seguimiento" destroyOnClose
			@close="handleClose">
			<p class="f-t-14">Revisa los estados de seguimiento y ajustalos segun tu preferencia</p>

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

			<div v-loading="loading">
				<template v-if="dataOpportunityTrackingDetail.length > 0">
					<div v-for="(value, index) in dataOpportunityTrackingDetail" :key="getChildId(value)"
						class="d-middle text-mid-gray-300 gap-x-3 my-4 min-h-9">
						<div class="d-middle-center rounded-lg h-[34px] w-[116px] border f-t-14 px-2"
							:style="{ borderColor: value.color, color: value.color }">
							{{ value.name }}
						</div>
						<i class="icon-trash text-lg cursor-pointer" @click="openDeleteChild(getChildId(value))"></i>
						<i class="icon-edit-2 text-lg cursor-pointer" @click="openEditChild(index)"></i>
						<el-tooltip content="Usos" placement="top">
							<div class="d-middle-end gap-x-1">
								<p class="text-black-300 f-tm-14">{{ value.uses }}</p>
								<i class="icon-mouse text-lg"></i>
							</div>
						</el-tooltip>
					</div>
				</template>

				<p v-else class="text-mid-gray-500 text-center my-8">No hay estados hijos registrados</p>

				<div v-if="isEdit !== null" class="d-middle gap-x-3 my-4 min-h-9">
					<el-input v-model="editForm.name" placeholder="Agregar titulo" class="!w-[222px]" maxlength="40"
						show-word-limit />
					<popoverPickerColor v-model="editForm.color" />
					<Button type="button" type-style="tertiary" @click="handleUpdateChild">Guardar</Button>
					<Button type="button" type-style="secondary" @click="cancelEdit">Cancelar</Button>
				</div>

				<div class="d-middle gap-x-3 mt-5">
					<el-input v-model="newChildForm.name" placeholder="Agregar titulo" class="!w-[222px]" maxlength="40"
						show-word-limit />
					<popoverPickerColor v-model="newChildForm.color" />
					<Button type="button" type-style="tertiary" @click="addContent">
						Agregar
					</Button>
				</div>
			</div>
		</ModalRight>

		<Modal ref="refModalDeleteTrackingStatus" type="danger" action="Eliminar" cancel="Cancelar"
			title="Eliminar estado" width="360" :onAction="handleDeleteTrackingStatus"
			@cancel="resetDeleteTrackingStatus" @close="resetDeleteTrackingStatus">
			<p>Deseas eliminar este estado de seguimiento? <br /> Esta accion es irreversible</p>
		</Modal>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import popoverPickerColor from '../components/popoverPickerColor.vue';
import { request } from '@request'
import * as Service from '../services/trackingService';

const emit = defineEmits(['update']);

const refModalSeeTrackingStatus = ref();
const refModalDeleteTrackingStatus = ref();

const dataOpportunityTrackingDetail = ref([]);
const loading = ref(false);
const parentRow = ref(null);
const isEdit = ref(null);
const currentEditId = ref(null);
const currentDeleteId = ref(null);

const editForm = ref({
	name: '',
	color: null,
});

const newChildForm = ref({
	name: '',
	color: null,
});

async function loadTrackingChildren(parentId) {
	loading.value = true;
	try {
		const { data, error } = await request(() => Service.getTrackingOpportunityDetail(parentId), false);
		if (error) {
			dataOpportunityTrackingDetail.value = [];
			return;
		}

		const detail = normalizeTrackingDetail(data);
		dataOpportunityTrackingDetail.value = normalizeTrackingChildren(detail);
	} catch (error) {
		dataOpportunityTrackingDetail.value = [];
	} finally {
		loading.value = false;
	}
}

async function addContent() {
	if (!newChildForm.value.name || !newChildForm.value.color || !parentRow.value?.id) return;

	const { error } = await request(() => Service.createSubState(parentRow.value.id, {
		name: newChildForm.value.name,
		color: newChildForm.value.color,
		state: 1,
	}));
	if (error) return;

    resetNewChildForm();
    await loadTrackingChildren(parentRow.value.id);
    emit('update');
}

function openEditChild(index) {
	const child = dataOpportunityTrackingDetail.value[index];
	if (!child) return;

	const childId = getChildId(child);
	if (!childId) return;

	isEdit.value = index;
	currentEditId.value = childId;
	editForm.value.name = child.name;
	editForm.value.color = child.color;
}

function cancelEdit() {
	isEdit.value = null;
	currentEditId.value = null;
	editForm.value.name = '';
	editForm.value.color = null;
}

async function handleUpdateChild() {
	if (!editForm.value.name || !editForm.value.color || !currentEditId.value) return;

	const { error } = await request(() => Service.updateSubState(parentRow.value.id, currentEditId.value, {
		name: editForm.value.name,
		color: editForm.value.color,
	}));
	if (error) return;

	cancelEdit();
	await loadTrackingChildren(parentRow.value.id);
	emit('update');
}

function openDeleteChild(childId) {
	if (!childId) return;
	currentDeleteId.value = childId;
	refModalDeleteTrackingStatus.value.open();
}

async function handleDeleteTrackingStatus() {
	if (!currentDeleteId.value) {
		resetDeleteTrackingStatus();
		return;
	}

	const { error } = await request(() => Service.deleteSubState(parentRow.value.id, currentDeleteId.value));
	if (error) return;

	refModalDeleteTrackingStatus.value.close();
	resetDeleteTrackingStatus();
	await loadTrackingChildren(parentRow.value.id);
	emit('update');
}

async function open(row) {
	parentRow.value = row;
	cancelEdit();
	resetNewChildForm();
	refModalSeeTrackingStatus.value.open();
	await loadTrackingChildren(row.id);
}

function resetNewChildForm() {
	newChildForm.value.name = '';
	newChildForm.value.color = null;
}

function resetDeleteTrackingStatus() {
	currentDeleteId.value = null;
}

function getChildId(child) {
	if (!child) return null;
	return child.idTracking ?? child.id ?? child.idChild ?? child.childId ?? null;
}

function normalizeTrackingDetail(payload) {
	return payload?.data ?? payload?.item ?? payload?.trackingOpportunity ?? payload ?? null;
}

function normalizeTrackingChildren(detail) {
	const candidates = [
		detail?.children,
		detail?.subStates,
		detail?.opportunityTrackingChildren,
		detail?.trackingChildren,
		detail?.data,
	];

	for (const candidate of candidates) {
		if (Array.isArray(candidate)) {
			return candidate;
		}
	}

	return [];
}

function handleClose() {
	cancelEdit();
	resetNewChildForm();
	resetDeleteTrackingStatus();
	loading.value = false;
	parentRow.value = null;
	dataOpportunityTrackingDetail.value = [];
}

function close() {
	refModalSeeTrackingStatus.value.close();
}

defineExpose({
	open,
	close,
});
</script>
