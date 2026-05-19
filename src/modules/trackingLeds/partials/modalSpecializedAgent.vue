<template>
	<ModalForm ref="refModalHandleAgent" :title="`${ isAssign ? 'Asignar': 'Editar' } agente especializado`" cancel="Cancelar" :action="isAssign ? 'Asignar': 'Guardar'" width="385" :onAction="handleActionCommercial"
		:initialValues="{ idAgent }" destroyOnClose
	>
		<p class="f-t-14">Elige uno de los usuarios para asignarlo como comercial principal</p>
		<Field v-slot="{ errorMessage }" name="idAgent" label="agente especializado">
			<p class="f-tm-16 mt-3 pb-1">Agente especializado</p>
			<el-select v-model="idAgent" placeholder="Seleccionar agente" popper-class="!w-[305px]" size="large" clearable>
				<el-option v-for="item in optionsAgent"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
			<Error :server="errorMessage" :local="errorMessage" />
		</Field>
	</ModalForm>
</template>

<script setup>
import { ref } from 'vue';
import { Field } from 'vee-validate';

const refModalHandleAgent = ref()

const isAssign = ref(true)
const idAgent = ref(null)
const idOpportunityEdit = ref(null)

const optionsAgent = ref([])

const emit = defineEmits(['submitForm'])

/* Functions */
function normalizeAgentOptions(options, currentIdAgent = null, currentAgentName = null) {
	const normalizedOptions = options.map(item => ({
		label: item.label ?? item.name ?? '',
		value: Number(item.value ?? item.idUser),
	}))
	const selectedId = normalizeAgentId(currentIdAgent)
	const hasCurrentOption = normalizedOptions.some(item => item.value === selectedId)

	if (selectedId !== null && currentAgentName && !hasCurrentOption) {
		normalizedOptions.unshift({
			label: currentAgentName,
			value: selectedId
		})
	}

	return normalizedOptions
}

function normalizeAgentId(value) {
	if (value === null || typeof value === 'undefined' || value === '') return null
	return Number(value)
}

async function handleActionCommercial() {
	emit('submitForm', {
		idOpportunity: idOpportunityEdit.value,
		idUser: normalizeAgentId(idAgent.value)
	})
}

async function open(options = [], idOpportunity = null, currentIdAgent = null, assign = true, currentAgentName = null) {
	optionsAgent.value = normalizeAgentOptions(options, currentIdAgent, currentAgentName)
	idOpportunityEdit.value = idOpportunity
	idAgent.value = normalizeAgentId(currentIdAgent)
	isAssign.value = assign
	refModalHandleAgent.value.open()
}

function close() {
	refModalHandleAgent.value.close()
}

defineExpose({
	open,
	close
})

</script>
