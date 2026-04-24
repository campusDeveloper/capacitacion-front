<template>
	<section class="vstack overflow-hidden w-full h-full">
		<Navbar name="Estados de interés" contentBtn="Crear estado" :action-back="goBack"
			:actionBtn="openCreateState" />
		<el-scrollbar view-class="p-7">
			<div class="d-middle gap-x-4 w-[420px] m-6">
				<img src="/img/illustrations/interes.svg" alt="" class="size-[120px] min-w-[120px]">
				<p class="f-t-12">Configura los estados de interés para clasificar a los leads según su intención de
					compra. Esta información ayuda a enfocar los esfuerzos comerciales en las oportunidades con mayor
					probabilidad de conversión.</p>
			</div>
			<el-table :data="dataOpportunityState" row-key="id" class="!w-fit table-sticky top-0">
				<el-table-column label="Estados interés" width="150">
					<template #default="{ row }">
						<div class="d-middle-center rounded-lg h-[26px] w-[117px]"
							:style="`background-color: ${row.color};`">
							<p class="f-t-12">{{ row.name }}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Descripción" prop="description" width="355" />
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
		<Modal ref="refModalActiveStateInterest" action="Activar" cancel="Cancelar" title="Activar estado de interés"
			width="360" :onAction="handleActiveStateInterest">
			<p>¿Deseas activar este estado de interés? <br /> Al hacerlo, se habilitarán sus funciones en todo el
				sistema</p>
		</Modal>
		<Modal ref="refModalInactiveStateInterest" type="danger" action="Inactivar" cancel="Cancelar"
			title="Inactivar estado de interés" width="360" woIcon :onAction="handleInactiveStateInterest">
			<p>¿Deseas inactivar este estado de interés? <br /> Al hacerlo, se inhabilitarán sus funciones en todo el
				sistema
			</p>
		</Modal>
		<Modal ref="refModalDeleteState" type="danger" action="Eliminar" cancel="Cancelar" title="Eliminar estado"
			width="360" :onAction="handleDeleteState">
			<p>¿Deseas eliminar este estado de interés? <br /> Esta acción es irreversible</p>
		</Modal>
		<modalManageState ref="refModalManageState" @update="loadOpportunityStates" />
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import modalManageState from '../partials/modalManageState.vue';
import * as Service from '../services/oportunityService'

const refModalActiveStateInterest = ref()
const refModalInactiveStateInterest = ref()
const refModalManageState = ref()
const refModalDeleteState = ref()
const loading = ref(false);
const router = useRouter();
const currentDeleteId = ref(null);
const currentToggleId = ref(null);
const currentToggleState = ref(null);
const dataOpportunityState = ref([]);
const options = [
	{ option: 'Editar', action: openEditStateInterest, icon: 'icon-edit-2' },
	{ option: 'Eliminar', action: openDeleteStateInterest, icon: 'icon-trash', danger: true },
]
const currentId = ref(null);


async function loadOpportunityStates() {
    loading.value = true;
    try {
        const res = await Service.getAllOpportunityStates();

        const states = res?.data?.data || [];
        dataOpportunityState.value = [...states].sort((a, b) => b.state - a.state);

    } catch (e) {
        console.error(e);
        dataOpportunityState.value = [];
    } finally {
        loading.value = false;
    }
}

function goBack() {
	router.push({ name: 'configuration.main' })
}

async function toggleState(row) {
    currentId.value = row.id;
    if (row.state === 0) {
        refModalActiveStateInterest.value.open();
    } else {
        refModalInactiveStateInterest.value.open();
    }
    return false;
}

async function handleActiveStateInterest() {
    await Service.switchOpportunityStatus(currentId.value);
    await loadOpportunityStates();
    refModalActiveStateInterest.value.close();
}


async function handleInactiveStateInterest() {
    await Service.switchOpportunityStatus(currentId.value);
    await loadOpportunityStates();
    refModalInactiveStateInterest.value.close();
}

function openCreateState() {
	refModalManageState.value.open()
}

function openEditStateInterest(row) {
    refModalManageState.value.openEdit(row);
}

function openDeleteStateInterest(row) {
    currentId.value = row.id;
    refModalDeleteState.value.open();
}
async function handleDeleteState() {
    await Service.deleteOpportunityState(currentId.value);
    await loadOpportunityStates();
    refModalDeleteState.value.close();
}
onMounted(() => {
    loadOpportunityStates();
});

</script>
