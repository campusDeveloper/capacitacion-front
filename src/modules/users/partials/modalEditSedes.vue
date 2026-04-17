<template>
	<ModalRight ref="refModalEditSedes" title="Editar sedes" width="345" @close="onCloseModal">
		<p class="text-black-300 f-tm-16 pb-1">Sede principal</p>
		<el-select v-model="idSede" placeholder="Selecciona la sede" size="large" >
			<el-option v-for="item in optionsSede" :key="item.idHeadquarter" :label="item.name"
				:value="item.idHeadquarter">
			</el-option>
		</el-select>
		<p class="text-black-300 f-tm-16 pb-1 mb-4 mt-7">Sedes secundarias</p>
		<div v-for="(item, index) in secondarySede" :key="index" class="d-middle gap-x-2 mb-1">
			<el-checkbox v-model="item.value" :true-value="1" :false-value="0" :indeterminate="false" size="small"
				:disabled="item.idHeadquarter === idSede"  />
			<p class="f-t-14 text-black-300">{{ item.name }}</p>
		</div>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { request } from '@request'

const refModalEditSedes = ref()
const idSede = ref(null)
const editingUserId = ref(null);
const secondarySede = ref([])
const optionsSede = ref([])

/* Functions */
async function open() {
	refModalEditSedes.value.open()
}

async function onCloseModal() {
	refModalEditSedes.value.close()
}

defineExpose({
	open,
	onCloseModal
})

</script>