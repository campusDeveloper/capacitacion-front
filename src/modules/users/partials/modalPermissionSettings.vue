 <template>
	<ModalFull ref="refModalConfigPermissions" title="Configuración de permisos">
		<el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon class="mb-4" :closable="false">
			<template #default>
				<Button type-style="secondary" size="small" class="mt-3" @click="loadPermissions">Reintentar</Button>
			</template>
		</el-alert>

		<el-table
			v-loading="loading"
			:data="usersPermissions"
			class="!w-fit table-sticky top-0"
			empty-text="No hay permisos para mostrar"
		>
			<el-table-column label="Usuarios" width="225">
				<template #default="{ row }">
					<div class="d-middle gap-x-3">
						<el-checkbox
							:model-value="row.value"
							:disabled="isUserDisabled(row.idUser)"
							@change="(value) => updateUserPermissions(row, value)"
						/>
						<p>{{ row.name }}</p>
					</div>
				</template>
			</el-table-column>

			<el-table-column v-for="module in modules" :key="module.id" width="180" align="center">
				<template #header>
					<div class="vstack items-center">
						<p>{{ module.label }}</p>
						<el-checkbox
							:model-value="moduleSelections[module.id]"
							:disabled="isModuleDisabled(module.id)"
							@change="(value) => updateModulePermissions(module.id, value)"
						/>
					</div>
				</template>
				<template #default="{ row }">
					<el-checkbox
						:model-value="row.permissions[module.id]"
						:disabled="isCellDisabled(row.idUser, module.id)"
						@change="(value) => updatePermissionCell(row, module.id, value)"
					/>
				</template>
			</el-table-column>
		</el-table>
	</ModalFull>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ElNotification } from 'element-plus';
import { PERMISSION_MODULES } from '../constants/permissionModules';
import { getPermissionsMatrix, updateBulkPermissions, updatePermission } from '../services/permissionSettingsService';
import {
	createInitialModuleSelections,
	createPermissionKey,
	normalizeUserPermission,
	toApiValue
} from '../helpers/permissionMatrix';

const refModalConfigPermissions = ref()
const loading = ref(false)
const errorMessage = ref('')
const usersPermissions = ref([])
const moduleSelections = ref(createInitialModuleSelections())
const updatingCells = ref(new Set())
const updatingUsers = ref(new Set())
const updatingModules = ref(new Set())

const modules = computed(() => PERMISSION_MODULES)
const hasUsers = computed(() => usersPermissions.value.length > 0)
const isUpdating = computed(() => {
	return updatingCells.value.size > 0
		|| updatingUsers.value.size > 0
		|| updatingModules.value.size > 0
})

function addUpdatingKey(target, key) {
	const next = new Set(target.value)
	next.add(key)
	target.value = next
}

function removeUpdatingKey(target, key) {
	const next = new Set(target.value)
	next.delete(key)
	target.value = next
}

function notifyPermissionError(message = 'No fue posible actualizar los permisos.') {
	ElNotification({
		title: 'Error!',
		message,
		type: 'error'
	})
}

function refreshUserSelection(user) {
	user.value = modules.value.every(module => user.permissions[module.id])
}

function refreshModuleSelections() {
	modules.value.forEach((module) => {
		moduleSelections.value[module.id] = hasUsers.value
			&& usersPermissions.value.every(user => user.permissions[module.id])
	})
}

function setLocalPermission(user, moduleId, value) {
	user.permissions[moduleId] = Boolean(value)
	refreshUserSelection(user)
	refreshModuleSelections()
}

function setLocalUserPermissions(user, value) {
	modules.value.forEach((module) => {
		user.permissions[module.id] = Boolean(value)
	})

	refreshUserSelection(user)
	refreshModuleSelections()
}

function setLocalModulePermissions(moduleId, value) {
	usersPermissions.value.forEach((user) => {
		user.permissions[moduleId] = Boolean(value)
		refreshUserSelection(user)
	})

	refreshModuleSelections()
}

function isCellUpdating(idUser, moduleId) {
	return updatingCells.value.has(createPermissionKey(idUser, moduleId))
}

function isUserUpdating(idUser) {
	return updatingUsers.value.has(idUser)
}

function isModuleUpdating(moduleId) {
	return updatingModules.value.has(moduleId)
}

function isCellDisabled(idUser, moduleId) {
	return loading.value || isUpdating.value || isCellUpdating(idUser, moduleId)
}

function isUserDisabled(idUser) {
	return loading.value || isUpdating.value || isUserUpdating(idUser)
}

function isModuleDisabled(moduleId) {
	return loading.value || isUpdating.value || isModuleUpdating(moduleId) || !hasUsers.value
}

async function loadPermissions() {
	loading.value = true
	errorMessage.value = ''

	try {
		const { data } = await getPermissionsMatrix()
		usersPermissions.value = (data?.data ?? []).map(normalizeUserPermission)
	} catch (error) {
		errorMessage.value = 'No fue posible cargar la matriz de permisos.'
		usersPermissions.value = []
	} finally {
		refreshModuleSelections()
		loading.value = false
	}
}

async function updatePermissionCell(user, moduleId, value) {
	const nextValue = Boolean(value)
	const previousValue = Boolean(user.permissions[moduleId])
	const key = createPermissionKey(user.idUser, moduleId)

	if (previousValue === nextValue || isCellDisabled(user.idUser, moduleId)) return

	setLocalPermission(user, moduleId, nextValue)
	addUpdatingKey(updatingCells, key)

	try {
		await updatePermission({
			idUser: user.idUser,
			module: moduleId,
			value: toApiValue(nextValue)
		})
	} catch (error) {
		setLocalPermission(user, moduleId, previousValue)
		notifyPermissionError()
	} finally {
		removeUpdatingKey(updatingCells, key)
	}
}

async function updateUserPermissions(user, value) {
	const nextValue = Boolean(value)
	const previousPermissions = { ...user.permissions }
	const previousValue = user.value

	if (isUserDisabled(user.idUser)) return

	setLocalUserPermissions(user, nextValue)
	addUpdatingKey(updatingUsers, user.idUser)

	try {
		await updateBulkPermissions({
			idUser: user.idUser,
			value: toApiValue(nextValue)
		})
	} catch (error) {
		user.permissions = previousPermissions
		user.value = previousValue
		refreshModuleSelections()
		notifyPermissionError('No fue posible actualizar los permisos del usuario.')
	} finally {
		removeUpdatingKey(updatingUsers, user.idUser)
	}
}

async function updateModulePermissions(moduleId, value) {
	const nextValue = Boolean(value)
	const previousUsers = usersPermissions.value.map(user => ({
		user,
		value: user.value,
		permissions: { ...user.permissions }
	}))

	if (isModuleDisabled(moduleId)) return

	setLocalModulePermissions(moduleId, nextValue)
	addUpdatingKey(updatingModules, moduleId)

	try {
		await updateBulkPermissions({
			module: moduleId,
			value: toApiValue(nextValue)
		})
	} catch (error) {
		previousUsers.forEach(({ user, value, permissions }) => {
			user.value = value
			user.permissions = permissions
		})
		refreshModuleSelections()
		notifyPermissionError('No fue posible actualizar los permisos del módulo.')
	} finally {
		removeUpdatingKey(updatingModules, moduleId)
	}
}

async function open() {
	refModalConfigPermissions.value.open()
	await loadPermissions()
}

defineExpose({
	open,
	loadPermissions
})

</script>
