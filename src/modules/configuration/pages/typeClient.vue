<template>
	<section class="vstack overflow-hidden w-full h-full">
		<Navbar name="Tipos de cliente" contentBtn="Crear tipo" :action-back="goBack"
			:actionBtn="openCreateClientType" />
		<el-scrollbar view-class="p-7">
			<div class="d-middle gap-x-4 w-[730px] m-6">
				<img src="/img/illustrations/clientes.svg" alt="" class="size-[120px] min-w-[120px]">
				<p class="f-t-12">Administra y configura las distintas etiquetas que puedes utilizar para clasificar y
					segmentar a los clientes dentro del sistema. Esta funcionalidad te permite organizar la informacion
					de manera mas precisa, facilitar la busqueda, mejorar el seguimiento comercial y optimizar la
					gestion de clientes segun sus caracteristicas o estados.</p>
			</div>
			<el-table :data="dataClientType" row-key="id" class="!w-fit table-sticky top-0">
				<el-table-column label="Tipo de cliente" width="150">
					<template #default="{ row }">
						<div class="d-middle-center rounded-lg h-[26px] w-[117px]"
							:style="`background-color: ${row.color};`">
							<p class="text-black-300 f-t-12">{{ row.name }}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Descripcion" prop="description" width="355" />
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
		<Modal ref="refModalActiveClientType" action="Activar" cancel="Cancelar" title="Activar tipo de cliente"
			width="360" :onAction="handleActiveClientType">
			<p>¿Deseas activar este tipo de cliente? <br /> Al hacerlo, se habilitaran sus funciones en todo el sistema
			</p>
		</Modal>
		<Modal ref="refModalInactiveClientType" type="danger" action="Inactivar" cancel="Cancelar"
			title="Inactivar tipo de cliente" width="360" woIcon :onAction="handleInactiveClientType">
			<p>¿Deseas inactivar este tipo de cliente? <br /> Al hacerlo, se inhabilitaran sus funciones en todo el
				sistema
			</p>
		</Modal>
		<Modal ref="refModalDeleteClientType" type="danger" action="Eliminar" cancel="Cancelar"
			title="Eliminar tipo de cliente" width="360" :onAction="handleDeleteClientType">
			<p>Deseas eliminar este tipo de cliente? <br /> Esta accion es irreversible</p>
		</Modal>
		<modalManageState ref="refModalManageState" @update="loadclientTypes" />
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import modalManageState from '../partials/moadalManageType.vue';
import { getCustomerTypes, deleteCustomerType, updateCustomerTypeState } from '../services/customerTypeService';
import { request } from "@request";

const refModalManageState = ref()
const refModalDeleteClientType = ref()
const refModalActiveClientType = ref()
const refModalInactiveClientType = ref()
const loading = ref(false);

const router = useRouter();
const currentToggleId = ref(null);
const currentDeleteId = ref(null);
const dataClientType = ref([])

const options = [
	{ option: 'Editar', action: openEditClientType, icon: 'icon-edit-2' },
	{ option: 'Eliminar', action: openDeleteClientType, icon: 'icon-trash', danger: true },
]

onMounted(() => {
	loadclientTypes();
});

function goBack() {
	router.push({ name: 'configuration.main' })
}

async function loadclientTypes() {
	loading.value = true;
	try {
		const { data, error } = await request(() => getCustomerTypes(), false);
		if (error) {
			dataClientType.value = [];
			return;
		}

		const array = Array.isArray(data) ? data : (data?.data || []);
		dataClientType.value = [...array].sort((a, b) => b.state - a.state);
	} catch (e) {
		dataClientType.value = [];
	} finally {
		loading.value = false;
	}
}

function toggleState(row) {
	currentToggleId.value = row.id;
	if (row.state == 1) {
		refModalInactiveClientType.value.open()
	} else {
		refModalActiveClientType.value.open()
	}
	return false;
}

async function handleActiveClientType() {
	if (currentToggleId.value == null) return;

	const { error } = await request(() => updateCustomerTypeState(currentToggleId.value, 1));
	if (error) return;

	await loadclientTypes();
	refModalActiveClientType.value.close();
	currentToggleId.value = null;
}

async function handleInactiveClientType() {
	if (currentToggleId.value == null) return;

	const { error } = await request(() => updateCustomerTypeState(currentToggleId.value, 0));
	if (error) return;

	await loadclientTypes();
	refModalInactiveClientType.value.close();
	currentToggleId.value = null;
}

function openCreateClientType() {
	refModalManageState.value.open()
}

function openEditClientType(row) {
	refModalManageState.value.openEdit(row)
}

function openDeleteClientType(row) {
	currentDeleteId.value = row.id;
	refModalDeleteClientType.value.open()
}

async function handleDeleteClientType() {
	if (currentDeleteId.value == null) return;

	const { error } = await request(() => deleteCustomerType(currentDeleteId.value));
	if (error) return;

	await loadclientTypes();
	refModalDeleteClientType.value.close();
	currentDeleteId.value = null;
}
</script>
