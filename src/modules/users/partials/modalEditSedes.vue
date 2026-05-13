<template>
	<ModalRight ref="refModalEditSedes" title="Editar sedes" width="345" @close="onCloseModal">
		<p class="text-black-300 f-tm-16 pb-1">Sede principal</p>
		<el-select v-model="idSede" placeholder="Selecciona la sede" size="large" class="!w-full" @change="onSedeChange">
			<el-option v-for="item in optionsSede" :key="item.idHeadquarter" :label="item.name"
				:value="item.idHeadquarter">
			</el-option>
		</el-select>
		<p class="text-black-300 f-tm-16 pb-1 mb-4 mt-7">Sedes secundarias</p>
		<div v-for="(item, index) in secondarySede" :key="index" class="d-middle gap-x-2 mb-1">
			<el-checkbox v-model="item.value" :true-value="1" :false-value="0" :indeterminate="false" size="small"
				:disabled="item.idHeadquarter === idSede" @change="updateSecondaryHeadquarter(item)" />
			<p class="f-t-14 text-black-300">{{ item.name }}</p>
		</div>
		<template #footer>
			<div class="d-middle-end gap-x-2">
				<Button type-style="secondary" class="min-w-[108px]" @click="onCloseModal">Cancelar</Button>
				<Button class="min-w-[112px]" @click="saveHeadquarters">Guardar</Button>
			</div>
		</template>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { request } from '@request'
import { getHeadquarters, getUserHeadquarters, updateMainHeadquarter, updateUserHeadquarter } from '../services/userService';

const refModalEditSedes = ref()
const idSede = ref(null)
const editingUserId = ref(null);
const secondarySede = ref([])
const optionsSede = ref([])
const emit = defineEmits(['editUser'])

/* Functions */
function resetData() {
	idSede.value = null
	editingUserId.value = null
	secondarySede.value = []
	optionsSede.value = []
}

async function loadHeadquarters() {
	const { data, error } = await request(() => getHeadquarters(), { success: false, error: true })
	if (error) return

	const rows = Array.isArray(data?.data) ? data.data : []
	optionsSede.value = rows.filter((item) => item.idHeadquarter !== null && item.state !== 0)
	secondarySede.value = optionsSede.value.map((item) => ({
		...item,
		value: 0
	}))
}

async function loadUserHeadquarters() {
	if (!editingUserId.value) return

	const { data, error } = await request(() => getUserHeadquarters(editingUserId.value), { success: false, error: true })
	if (error) return

	syncUserHeadquarters(data?.data)
}

function syncUserHeadquarters(userHeadquarters = {}) {
	idSede.value = userHeadquarters.mainHeadquarter ?? null
	const headquarters = Array.isArray(userHeadquarters.headquarters) ? userHeadquarters.headquarters : []

	secondarySede.value = secondarySede.value.map((item) => ({
		...item,
		value: headquarters.includes(item.idHeadquarter) && item.idHeadquarter !== idSede.value ? 1 : 0
	}))
}

async function open(data = null) {
	resetData()
	editingUserId.value = data?.id ?? null
	await loadHeadquarters()
	await loadUserHeadquarters()
	refModalEditSedes.value.open()
}

async function onCloseModal() {
	resetData()
	refModalEditSedes.value.close()
}

function onSedeChange() {
	secondarySede.value = secondarySede.value.map((item) => ({
		...item,
		value: item.idHeadquarter === idSede.value ? 0 : item.value
	}))
}

async function updateSecondaryHeadquarter(item) {
	if (!editingUserId.value || item.idHeadquarter === idSede.value) return

	const previousValue = item.value ? 0 : 1
	const payload = {
		idHeadquarter: item.idHeadquarter,
		value: item.value
	}

	const { data, error } = await request(() => updateUserHeadquarter(editingUserId.value, payload))
	if (error) {
		item.value = previousValue
		return
	}

	syncUserHeadquarters(data?.data)
	emit('editUser')
}

async function saveHeadquarters() {
	if (!editingUserId.value || !idSede.value) return

	const payload = {
		idHeadquarter: idSede.value
	}

	const { data, error } = await request(() => updateMainHeadquarter(editingUserId.value, payload))
	if (error) return

	syncUserHeadquarters(data?.data)
	emit('editUser')
	onCloseModal()
}

defineExpose({
	open,
	onCloseModal
})

</script>
