<template>
	<section class="vstack overflow-hidden w-full h-full">
		<Navbar name="Seguimiento" contentBtn="Crear estado" :action-back="goBack"
			:actionBtn="openCreateTrackingState" />
		<el-scrollbar view-class="p-7">
			<div class="d-middle gap-x-4 w-[420px] m-6">
				<img src="/img/illustrations/seguimiento.svg" alt="" class="size-[120px] min-w-[120px]">
				<p class="f-t-12">Administra el seguimiento y sus diferentes estados que representan el avance de cada
					cliente o lead dentro del proceso inicial. Facilita el control de las interacciones, el historial de
					contacto y la toma de decisiones en cada etapa.</p>
			</div>
			<el-table :data="dataOpportunityTracking" class="!w-fit table-sticky top-0">
				<el-table-column label="Seguimiento" width="150">
					<template #default="{ row }">
						<div class="d-middle-center rounded-lg h-[26px] !w-fit px-3"
							:style="`border: 1px solid${row.color};`">
							<p class="f-t-12">{{ row.name }}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Estados seguimiento" align="right" width="110">
					<template #default="{ row }">
						<div class="d-middle-end gap-x-2">
							<p class="f-t-12">{{ row.countHijos }}</p>
							<i class="icon-eye-fill cursor-pointer" @click="openSeeTrackingStatus(row)" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Usos" width="100" align="right">
					<template #default="{ row }">
						<div class="d-middle-end gap-x-1">
							<p class="text-mid-gray-600 f-tm-12">{{ row.uses }}</p>
							<i class="icon-mouse text-lg" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Estado" width="100" align="center">
					<template #default="{ row }">
						<el-switch v-model="row.state" :active-value="1" :inactive-value="0" size="small"
							:class="{ 'row-disabled': !row.state }" :before-change="() => toggleState(row)" />
					</template>
				</el-table-column>
				<el-table-column width="55" align="center">
					<template #default="{ row }">
						<DropdownOptions :params="row" :options="options" placement="right" />
					</template>
				</el-table-column>
			</el-table>
		</el-scrollbar>
		<Modal ref="refModalActiveTrackingStatus" action="Activar" cancel="Cancelar"
			title="Activar estado de seguimiento" width="360" :onAction="handleActiveTrackingStatus">
			<p>¿Deseas activar este estado de seguimiento? <br /> Al hacerlo, se habilitarán sus funciones en todo el
				sistema
			</p>
		</Modal>
		<Modal ref="refModalInactiveTrackingStatus" type="danger" action="Inactivar" cancel="Cancelar"
			title="Inactivar estado de seguimiento" width="360" woIcon :onAction="handleInactiveTrackingStatus">
			<p>¿Deseas inactivar este estado de seguimiento? <br /> Al hacerlo, se inhabilitarán sus funciones en todo
				el
				sistema
			</p>
		</Modal>
		<Modal ref="refModalDeleteTrackingStatus" type="danger" action="Eliminar" cancel="Cancelar"
			title="Eliminar estado" width="360" :onAction="handleDeleteTrackingStatus">
			<p>¿Deseas eliminar este estado de seguimiento? <br /> Esta acción es irreversible</p>
		</Modal>
		<modalManageTrackingState ref="refModalManageTrackingState"  />
		<modalSeeTrackingStatus ref="refModalSeeTrackingStatus" />
	</section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import modalManageTrackingState from '../partials/modalManageTrackingState.vue';
import modalSeeTrackingStatus from '../partials/modalSeeTrackingStatus.vue';
import { request } from "@request";

const refModalManageTrackingState = ref()
const refModalActiveTrackingStatus = ref()
const refModalInactiveTrackingStatus = ref()
const refModalDeleteTrackingStatus = ref()
const refModalSeeTrackingStatus = ref()
const router = useRouter();
const currentToggleId = ref(null);
const currentToggleState = ref(null);
const options = [
	{ option: 'Editar', action: openEditTrackingState, icon: 'icon-edit-2' },
	{ option: 'Eliminar', action: openDeleteTrackingState, icon: 'icon-trash', danger: true },
]
const refModalActiveStateInterest = ref()
const refModalInactiveStateInterest = ref()
const refModalManageState = ref()
const refModalDeleteState = ref()
const loading = ref(false);
const currentDeleteId = ref(null);
const dataOpportunityTracking = ref([]);

function goBack() {
	router.push({ name: 'configuration.main' })
}

function openCreateTrackingState() {
	refModalManageTrackingState.value.open()
}

function openSeeTrackingStatus() {
	refModalSeeTrackingStatus.value.open()
}

function toggleState() {
	if (1) {
		refModalActiveTrackingStatus.value.open()
	} else {
		refModalInactiveTrackingStatus.value.open()
	}

}

async function handleActiveTrackingStatus() {
	
}

async function handleInactiveTrackingStatus() {
	
}

function openEditTrackingState() {
	refModalManageTrackingState.value.openEdit()
}

function openDeleteTrackingState() {
	refModalDeleteTrackingStatus.value.open()
}

async function handleDeleteTrackingStatus() {
	
}

</script>