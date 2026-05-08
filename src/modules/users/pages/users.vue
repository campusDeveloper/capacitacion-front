<template>
	<section class="vstack overflow-hidden h-full w-full">
		<Navbar name="Usuarios" contentBtn="Crear usuario" :actionBtn="openCreateUser" />
		<el-scrollbar view-class="px-10 pt-10 pb-6">
			<div class="d-middle gap-x-4 text-[rgb(var(--xx-color-text-primary))]">
				<h1 class="f-tm-18 self-end me-auto">Lista de usuarios</h1>
				<el-input v-model="search" placeholder="Buscar" class="relative self-end !w-[250px]" >
					<template #suffix>
						<Button type-style="tertiary" class="absolute right-0 !rounded-lg !p-0" disabled>
							<i class="icon-search !text-xl" />
						</Button>
					</template>
				</el-input>
				<div class="flex flex-col gap-y-2">
					<h3>Tipo de usuario*</h3>
					<el-select v-model="userTypeFilter" class="!w-[224px]" placeholder="Seleccionar el tipo"
						 clearable>
						<el-option v-for="userType in userTypeOptions" :key="userType.idRol" :label="userType.name"
							:value="userType.idRol" />
					</el-select>
				</div>
				<Button class="d-middle self-end" @click="openConfigPermissions">
					<i class="icon-setting-2 !text-xl pe-2" />
					Permisos
				</Button>
			</div>
			<div class="d-middle gap-8 mt-12 flex-wrap">
				<userCard v-for="(user, key) in usersData" :key="key" :data="user" @openEdit="openEditUser" @openLink="openLinkForza"
					@openDelete="openDeleteUser" @onDelete="deleteUser" @onChangeState="toggleUserState"
					@handleChangeState="handleChangeState" @openEditSedes="openEditSedes" />
			</div>
		</el-scrollbar>
		<Modal ref="refModalActiveUser" action="Activar" cancel="Cancelar" title="Activar usuario" width="360"
			:onAction="handleActiveUser">
			<p>¿Deseas activar este usuario? <br /> Al hacerlo, se habilitarán sus funciones en todo el
				sistema</p>
		</Modal>
		<Modal ref="refModalInactiveUser" type="danger" action="Inactivar" cancel="Cancelar" title="Inactivar usuario"
			width="360" woIcon :onAction="handleInactiveUser">
			<p>¿Deseas inactivar este usuario? <br /> Al hacerlo, se inhabilitarán sus funciones en todo el
				sistema
			</p>
		</Modal>
		<Modal ref="refModalDeleteUser" type="danger" action="Eliminar" cancel="Cancelar" title="Eliminar usuario"
			width="360" :onAction="handleDeleteUser">
			<p>¿Deseas eliminar este usuario? <br /> Esta acción es irreversible.</p>
			<br />
			<p>Recuerda que también puedes inactivarlo para deshabilitar sus funciones en el sistema</p>
		</Modal>
		<modalManageUser ref="refModalManageUser" @success="getLoadUsers" />
		<modalEditSedes ref="refModalEditSedes" @editUser="getLoadUsers" />
		<modalPermissionSettings ref="refModalPermissionSettings" />
	</section>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import modalManageUser from '../partials/modalManageUser.vue';
import modalEditSedes from '../partials/modalEditSedes.vue';
import modalPermissionSettings from '../partials/modalPermissionSettings.vue';
import userCard from '../components/userCard.vue';
import { request } from '@request'

const refModalActiveUser = ref()
const refModalInactiveUser = ref()
const refModalManageUser = ref()
const refModalDeleteUser = ref()
const refModalEditSedes = ref()
const refModalPermissionSettings = ref()

const userTypeFilter = ref(null)
const search = ref(null)
const usersData = ref([])

const currentToggleId = ref(null)
const currentDeleteId = ref(null)

const userTypeOptions = ref([
	{
		idRol: 1,
		name: 'Administrador'
	},
	{
		idRol: 2,
		name: 'Comercial'
	}
])

let searchTimeout = null;

function openCreateUser() {
	refModalManageUser.value.open(1)
}

function openConfigPermissions() {
	refModalPermissionSettings.value.open()
}

function openEditUser() {
	refModalManageUser.value.open()
}

function openDeleteUser() {
	refModalDeleteUser.value.open()
}

async function handleDeleteUser() {
	
}

function openEditSedes() {
	refModalEditSedes.value.open()
}

function handleChangeState(data) {
	if (true) {
		refModalActiveUser.value.open()
	} else {
		refModalInactiveUser.value.open()
	}
}

async function handleInactiveUser() {
	
}

async function handleActiveUser() {
	
}

function openLinkForza() {
}

function deleteUser() {
}

function toggleUserState() {
}

</script>
