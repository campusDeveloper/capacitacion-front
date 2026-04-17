<template>
	<ModalForm ref="refModalHandleAgent" :title="`${ isAssign ? 'Asignar': 'Editar' } agente especializado`" cancel="Cancelar" :action="isAssign ? 'Asignar': 'Guardar'" width="385" :onAction="handleActionCommercial"
		:initialValues="{ idAgent }" destroyOnClose
	>
		<p class="f-t-14">Elige uno de los usuarios para asignarlo como comercial principal</p>
		<Field v-slot="{ field, errorMessage }" name="idAgent" label="agente especializado" rules="required">
			<p class="f-tm-16 mt-3 pb-1">Agente especializado</p>
			<el-select v-model="idAgent" placeholder="Seleccionar" popper-class="!w-[305px]" size="large" v-bind="field">
				<el-option v-for="item in optionsAgent"
					:key="item.idUser"
					:label="item.name"
					:value="item.idUser">
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
async function handleActionCommercial() {
}

async function open( ) {
   
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
