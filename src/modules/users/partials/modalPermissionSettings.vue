<template>
	<ModalFull ref="refModalConfigPermissions" title="Configuración de permisos">
		<el-table :data="userPermissions" class="!w-fit table-sticky top-0">
			<el-table-column label="Usuarios" width="225">
				<template #default="{ row }">
					<div class="d-middle gap-x-3">
						<el-checkbox v-model="row.value" :disabled="updating" :true-value="1" :false-value="0"  />
						<p>{{ row.name }}</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column v-for="(rowHead, indexHead) in permissions" :key="indexHead" width="180" align="center">
				<template #header>
					<div class="vstack items-center">
						<p>{{ rowHead.name }}</p>
						<el-checkbox v-model="rowHead.value" :disabled="updating" :key="indexHead + 'head'" :true-value="1" :false-value="0"
							 />
					</div>
				</template>
				<template #default="{ row }">
					<el-checkbox v-model="row.permissions[indexHead].value" :disabled="updating" :key="indexHead + 'cel'" :true-value="1" :false-value="0"
						 />
				</template>
			</el-table-column>
		</el-table>
	</ModalFull>
</template>

<script setup>
import { ref } from 'vue';
import { request } from '../../../services/http'

const refModalConfigPermissions = ref()
const updating = ref(false)

const userPermissions = ref([])

const permissions = ref([
	{
		module: 1,
		name: "Clientes",
		value: 0
	},
	{
		module: 2,
		name: "Seguimiento Leads",
		value: 0
	},
	{
		module: 3,
		name: "Pre-Reservas",
		value: 0
	},
	{
		module: 4,
		name: "Chats",
		value: 0
	},
	{
		module: 5,
		name: "Mensajes Masivos",
		value: 0
	},
	{
		module: 6,
		name: "Usuarios",
		value: 0
	},
	{
		module: 7,
		name: "Configuracion",
		value: 0
	},
])

async function open() {
	refModalConfigPermissions.value.open()
}

defineExpose({
	open
})

</script>
