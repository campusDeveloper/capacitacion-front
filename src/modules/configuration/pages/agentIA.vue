<template>
	<section class="vstack overflow-hidden w-full h-full">
		<Navbar name="Configuraciones Agente IA" contentBtn="Agregar configuración" :action-back="goBack"
			:actionBtn="toGoAddConfig" />
		<EmptyView v-if="!agentConfigs.length" imgUrl="/img/illustrations/categorias-agentes.svg" 
			:data="{ title: 'Sin configuraciones', description: 'Agrega una configuración para el Agente de IA' }" whImg="200"/>
		<el-scrollbar v-else view-class="flex flex-wrap pt-10 pr-9 pb-12 pl-8 gap-x-[22px] gap-y-8 mb-12">
			<!-- <cardAGentIA 
				v-for="item in agentConfigs" 
				:key="item.idAgent"
				:agentConfig="item" 
				@openActive="openActive" 
				@openEdit="openEdit" 
				@openDelete="openDelete"
			/> -->
		</el-scrollbar>
		<Modal ref="refModalActiveConfig" action="Activar" cancel="Cancelar" title="Activar configuración" width="362" :onAction="confirmToggleState">
			<p>¿Deseas activar esta configuración? <br /> Al hacerlo, se desactivará la configuración actual y se aplicarán las funciones de esta configuración al Agente.</p>
		</Modal>
		<Modal ref="refModalDeleteConfig" action="Eliminar" type="danger" title="Eliminar configuración" width="362" :onAction="confirmDelete">
			<p>¿Deseas eliminar esta configuración?<br />Esta acción es irreversible</p>
		</Modal>
		<modalHandleConfig ref="refModalHandleConfig" @success="handleSuccess" />
	</section>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@request'
import cardAGentIA from '../components/cardAgentIA.vue';
import modalHandleConfig from '../partials/agentIA/modalHandleConfig.vue';
import * as Service from '../services/agentConfig'

const refModalActiveConfig = ref()
const refModalDeleteConfig = ref();
const refModalHandleConfig = ref();
const agentToToggle = ref(null);
const agentToDelete = ref(null);

const router = useRouter();
const agentConfigs = ref([])

onBeforeMount(async () => {
	//await getPrincipalConfiguration();
})

async function getPrincipalConfiguration(){
	const { data, error } = await request(()=> Service.getPrincipalConfiguration());
	if (error) return 
	agentConfigs.value = data?.data ?? [];
}

function openActive(agent) {
	agentToToggle.value = agent;
	refModalActiveConfig.value.open();
}
function reorderAgents() {
	const activeAgent = agentConfigs.value.find(a => a.state === 1);
	const others = agentConfigs.value.filter(a => a.state !== 1);
	agentConfigs.value = activeAgent ? [activeAgent, ...others] : others;
}
async function confirmToggleState() {
	if (!agentToToggle.value) return;
	
	const { error } = await request(() =>
		Service.toggleState(agentToToggle.value.idAgent)
	);
	
	if (error) {
		refModalActiveConfig.value.close();
		return;
	}

	agentConfigs.value = agentConfigs.value.map(a => ({
		...a,
		state: a.idAgent === agentToToggle.value.idAgent ? 1 : 0
	}));
	reorderAgents();

	refModalActiveConfig.value.close();
	agentToToggle.value = null;
}

function openDelete(agent) {
	agentToDelete.value = agent;
	refModalDeleteConfig.value.open();
}

async function confirmDelete() {
	if (!agentToDelete.value) return;
	
	const { error } = await request(() => Service.deleteAgent(agentToDelete.value.idAgent));
	
	if (error) {
		refModalDeleteConfig.value.close();
		return;
	}
	
	refModalDeleteConfig.value.close();
	agentToDelete.value = null;
	await getPrincipalConfiguration();
}
async function handleSuccess() {
	await getPrincipalConfiguration();
		reorderAgents();

}
function goBack() {
	router.push({ name: 'configuration.main' })
}

function openEdit(toEditData) {
	refModalHandleConfig.value.openEdit(toEditData)
}

function toGoAddConfig() {
	refModalHandleConfig.value.open()
}
</script>