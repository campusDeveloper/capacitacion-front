<template>
	<ModalFull ref="refModalHandleConfig" :title="`${ identifyModal ? 'Agregar': 'Editar' } configuración`">
		<Form :key="routeId + '-' + (module.apiKey ? 1 : 0)"@submit="onHandleConfig" ref="refFormConfig" class="vstack pt-6 pr-14 pb-10 pl-6" :initial-values="{ ...module }">
            
			<div class="d-middle f-t-16 gap-4">
				<p>Inactiva</p>
				<el-switch v-model="module.state" :active-value="1" :inactive-value="0"/>
				<p>Activa</p>
			</div>
			<div class="flex justify-between mt-8 f-tm-14 gap-x-6">
				<div class="flex flex-col w-full mt-2">
					<Field v-slot="{ field, errorMessage }" name="name" label="nombre" rules="required">
						<p>Nombre de la configuración</p>
						<el-input v-model="module.name" placeholder="Ej: Agente de soporte" size="large" class="!w-full mt-1" autocomplete="new-password" v-bind="field"/>
						<Error server="name" :local="errorMessage" v-bind="field"/>
					</Field>
				</div>
				<div class="flex flex-col w-full mt-2">
					<Field v-slot="{ field, errorMessage }" name="apiKey" label="apiKey" rules="required">
						<p>API Key de Open Router</p>
						<el-input v-model="module.apiKey" :type="showApiKey ? 'text' : 'password'" placeholder="Agrega el API Key" size="large" autocomplete="new-password" class="!w-full mt-1" v-bind="field">
							<template #suffix>
								<i class="icon-eye-fill !text-[rgb(var(--xx-color-icons-brand))]" @click="showApiKey = !showApiKey"/>
							</template>
						</el-input>
						<Error server="apiKey" :local="errorMessage" v-bind="field"/>
						<p v-if="!errorMessage" class="f-tl-12 text-tertiary ml-4">Se encriptará en producción</p>
					</Field>
				</div>
			</div>
			<div class="mt-4 f-tm-14 flex flex-col gap-y-1">
				<Field v-slot="{ field, errorMessage }" name="description" label="descripción" rules="required|max:300">
					<p>Descripción</p>
					<el-input type="textarea" v-model="module.description" placeholder="Describe el propósito de esta configuración" v-bind="field" maxlength="300"/>
					<Error server="description" :local="errorMessage" v-bind="field"/>
					<p v-if="!errorMessage" class="f-tl-12 text-tertiary ml-4 relative">Máximo 500 caracteres</p>
				</Field>
			</div>
			<div class="d-middle-bt gap-x-5">
				<!-- EMBEDDINGS -->
				<div class="w-[80%] h-[480px] d-middle-center bg-[rgb(var(--xx-color-surface-primary))] rounded-xl mt-8 vstack shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div class="vstack w-full h-[109px] border-b gap-y-1 p-5 pl-6 border-b-white-500">
                        <div class="d-middle-bt">
                            <h1 class="f-ts-16 text-[rgb(var(--xx-color-text-black))]">Embeddings</h1>
                            <el-tooltip content="Gestionar embeddings" placement="top" popper-class="modal-full-popper">
                                <i class="icon-setting-2 cursor-pointer text-xl text-[rgb(var(--xx-color-icons-subtle))]" @click="openModalManageEmbeddings"/>
                            </el-tooltip>
                        </div>
                        <p class="text-primary f-t-12 w-[90%]">Define el modelo usado para generar vectores de búsqueda semántica en tu base de conocimiento</p>
                    </div>
                    <div class="vstack p-6 h-full w-full">
                        <p class="text-primary">Modelo de embedding</p>
                        <el-select v-model="module.embeddingModel" size="large" popper-class="modal-full-popper" class="mt-1" placeholder="Seleccionar modelo">
                            <el-option v-for="model in embeddingModels" :key="model.idAgentEmbedding" :label="model.modelName" :value="model.idAgentEmbedding"/>
                        </el-select>
                        <p v-if="!module.embeddingModel" class="my-auto f-t-14 text-tertiary text-center">Selecciona un modelo de embedding para ver los detalles</p>
                        <div v-else class="w-full max-h-[125px] p-3 pl-4 bg-dark-gray-50 mt-4 rounded-lg shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
                            <div class="d-middle-bt">
                                <h1 class="f-tm-14 text-mid-gray-600">{{selectedEmbedding?.modelName }}</h1>
                            </div>
                            <p class="f-t-12 mt-1 !w-full text-primary line-clamp-4">{{selectedEmbedding?.description }}</p>
                        </div>
                    </div>
                </div>
				<!-- LLM  -->
				<div class="w-[80%] d-middle-center h-[480px] bg-[rgb(var(--xx-color-surface-primary))] rounded-xl mt-8 vstack shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <section class="vstack w-full h-[132px] border-b gap-y-1 p-5 pl-6 border-b-white-500">
                        <div class="d-middle-bt">
                            <h1 class="f-ts-16 text-[rgb(var(--xx-color-text-black))]">LLM Conversacional</h1>
                            <el-tooltip content="Gestionar modelos" placement="top" popper-class="modal-full-popper">
                                <i class="icon-setting-2 cursor-pointer text-xl text-[rgb(var(--xx-color-icons-subtle))]" @click="() => refModalManageLlm.open()"/>
                            </el-tooltip>
                        </div>
                        <p class="text-primary f-t-12 w-[90%]">Configura el cerebro del agente que genera las respuestas conversacionales</p>
                    </section>
                    <section class="vstack p-6 h-full w-full">
                        <p class="text-primary">Modelo conversacional</p>
                        <el-select v-model="module.conversationalModels" size="large" popper-class="modal-full-popper" class="mt-1" placeholder="Seleccionar modelo">
                            <el-option v-for="model in conversationalModels" :key="model.idAgentConversational" :label="model.modelName" :value="model.idAgentConversational"/>
                        </el-select>
                        <p v-if="!module.conversationalModels" class="my-auto f-t-14 text-tertiary text-center">Selecciona un modelo conversacional para ver los detalles</p>
                        <div v-else class="w-full h-[221px] p-3 pl-4 bg-dark-gray-50 mt-4 rounded-lg shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
                            <div class="d-middle-bt">
                                <h1 class="f-t-14 text-[rgb(var(--xx-color-text-black))]">{{selectedLLM?.modelName }}</h1>
                                <!-- <i class="cursor-pointer icon-trash text-[rgb(var(--xx-color-icons-danger))]"/> -->
                            </div>
                            <div class="d-middle-bt w-full mt-4 gap-x-4">
                                <div class="text-[rgb(var(--xx-color-text-black))] w-full">
                                    <p class="f-tm-14">Temperatura</p>
                                    <el-progress :show-text="false" :percentage="Number(module.llmPercentage) * 100 || 0" class="mt-1 full-progress" :stroke-width="12"/>
                                    <div class="d-middle-bt f-t-12 mt-1 text-primary">
                                        <p>Preciso</p>
                                        <p>Creativo</p>
                                    </div>
                                </div>
                                <el-input-number :controls="false" v-model="module.llmPercentage" class="w-[60px]" placeholder="0.0" :max="100" :min="0"/>
                            </div>
                            <div class="mt-4">
                                <p class="f-tm-14">Máximo de Tokens</p>
                                <el-input-number :controls="false" v-model="module.maxTokens" placeholder="Digita la cantidad" class="!w-full mt-1"/>
                                <p class="f-t-12 text-tertiary ml-4 relative">Límite de respuesta</p>
                            </div>
                        </div>
                    </section>
                </div>
				<!-- SYSTEM PROMPT -->
				<div class="w-[80%] h-[480px] d-middle-center bg-[rgb(var(--xx-color-surface-primary))] rounded-xl mt-8 vstack shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
					<section class="w-full vstack h-[132px] border-b gap-y-1 p-5 pl-6 border-b-white-500">
						<div class="d-middle-bt">
							<h1 class="f-ts-16 text-[rgb(var(--xx-color-text-black))]">System Prompt</h1>
							<el-tooltip content="Gestionar prompts" placement="top" popper-class="modal-full-popper">
								<i class="icon-setting-2 cursor-pointer text-xl text-[rgb(var(--xx-color-icons-subtle))]" @click="() => refModalManagePrompts.open()"/>
							</el-tooltip>
						</div>
						<p class="text-primary f-t-12 w-[90%]">Define la personalidad, tono y comportamiento base del agente</p>
					</section>
					<section class="vstack p-6 h-full w-full">
						<p class="text-primary">Prompt</p>
						<el-select v-model="module.prompt" size="large" popper-class="modal-full-popper" class="mt-1" placeholder="Seleccionar">
							<el-option v-for="prompt in prompts" :key="prompt.idAgentPrompt" :label="prompt.name" :value="prompt.idAgentPrompt"/>
						</el-select>
						<p v-if="!module.prompt" class="my-auto f-t-14 text-tertiary text-center">Selecciona un prompt para ver los detalles</p>
						<div v-else class="mt-4">
							<p class="f-tm-14">Prompt actual:</p>
							<div class="w-full max-h-[182px] p-3 pl-4 bg-dark-gray-50 mt-4 rounded-lg shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
								<div class="d-middle-bt">
									<h1 class="f-t-14 text-[rgb(var(--xx-color-text-black))]">{{selectedPrompt?.name || 'sin Nombre' }}</h1>
									<div class="d-middle gap-0.5">
										<i class="cursor-pointer icon-edit-2 text-[rgb(var(--xx-color-icons-subtle))]" @click="() => refModalEditPrompt.open()"/>
										<!-- <i class="cursor-pointer icon-trash text-[rgb(var(--xx-color-icons-danger))]"/> -->
									</div>
								</div>
								<p class="f-t-12 mt-3 !w-full text-primary line-clamp-5">{{selectedPrompt?.description }}</p>
								<p class="f-tl-10 mt-4">Ult. act. {{ DateFormat(new Date(), 'DD MMM YYYY')}}</p>
							</div>
						</div>
					</section>
				</div>
			</div>
            <div class="!w-full mt-8 d-middle-end gap-x-4 me-auto">
                <Button type-style="secondary" size="large" type="button" class="!min-w-[135px]" @click="close"> {{ 'Cancelar' }} </Button>
                <Button type="submit" size="large" class="!min-w-[109px]"> {{ 'Guardar' }} </Button>
            </div>
		</Form>
		<modalManageEmbedding ref="refModalManageEmbeddings"/>
		<modalManageLlm ref="refModalManageLlm"/>
		<modalManagePrompts ref="refModalManagePrompts" />
		<ModalForm ref="refModalEditPrompt" title="Editar prompt" width="480" action="Guardar" cancel="Cancelar">
            <p class="f-tm-14">Título</p>
            <Field v-slot="{ field, errorMessage }" name="title" label="título" rules="required">
                <el-input v-model="editPrompt.title" placeholder="Agrega un título" class="!w-full mt-1" v-bind="field" />
                <Error server="titulo" :local="errorMessage" v-bind="field" />
            </Field>
            <p class="mt-3 f-tm-14">Descripción</p>
            <Field v-slot="{ field, errorMessage }" name="description" label="descripción" rules="required">
                <el-input v-model="editPrompt.description" type="textarea" placeholder="Agrega una descripción" class="!w-full mt-1" :rows="8" v-bind="field"/>
                <Error server="description" :local="errorMessage" v-bind="field" />
            </Field>
        </ModalForm>
	</ModalFull>
</template>

<script setup>
import { ref, nextTick, onBeforeMount, watch, computed } from 'vue';
import { Field, Form } from 'vee-validate';
import { DateFormat } from '@/util/dateFormat';
import modalManageEmbedding from './modalManageEmbedding.vue';
import modalManageLlm from './modalManageLlm.vue';
import modalManagePrompts from './modalManagePrompts.vue';
import { request } from '@request'
import * as Service from '../../services/agentConfig'

const refModalHandleConfig = ref()
const refModalManageEmbeddings = ref();
const refModalManagePrompts = ref();
const refModalEditPrompt = ref();
const refModalManageLlm = ref();
const refFormConfig = ref();

const identifyModal = ref(true)
const showApiKey = ref(false)
const agentIdToEdit = ref(null) 

const module = ref({
	state: 0,
	name: '',
	apiKey: '',
	description: '',
	embeddingModel: null,
	conversationalModels: null,
	llmPercentage: 0,
	maxTokens: 0,
	prompt: null
})

const editPrompt = ref({
    title: null,
    description: null
})

const embeddingModels = ref([])
const conversationalModels = ref([])
const prompts = ref([])

const selectedPrompt = computed(() => {
	if (!module.value.prompt || !prompts.value.length) return null;
	return prompts.value.find(prompt => prompt.idAgentPrompt === module.value.prompt);
})

const selectedLLM = computed(() => {
	if (!module.value.conversationalModels || !conversationalModels.value.length) return null;
	return conversationalModels.value.find(conversation => conversation.idAgentConversational === module.value.conversationalModels);
})

const selectedEmbedding = computed(() => {
	if (!module.value.embeddingModel || !embeddingModels.value.length) return null;
	return embeddingModels.value.find(embedding => embedding.idAgentEmbedding === module.value.embeddingModel);
})

watch(selectedLLM, (newModel) => {
	if (!agentIdToEdit.value && newModel) {
		module.value.llmPercentage = Number(newModel.temperature) || 0;
		module.value.maxTokens = Number(newModel.maxTokens) || 0;
	}
});

onBeforeMount(async () => {
//   await Promise.all([
//     getEmbeddings(),
//     getConversational(),
//     getPrompts()
//   ]);
});

/* Functions */
async function getEmbeddings() {
	const { data, error } = await request(() => Service.getEmbeddings())
	if (error) return
	embeddingModels.value = data?.data ?? [];
}

async function getConversational() {
	const { data, error } = await request(() => Service.getConversational())
	if (error) return
	conversationalModels.value = data?.data ?? [];
}

async function getPrompts() {
	const { data, error } = await request(() => Service.getPrompt())
	if (error) return
	prompts.value = data?.data ?? [];
}

async function loadAgentData(idAgent) {

	const { data, error } = await request(() => Service.getAgentById(idAgent));	
	
	
	if (error) {
		console.error('Error al cargar agente:', error);
		return;
	}
	
	const agent = data?.data ?? data;
	
	module.value = {
		state: agent.state ?? 0,
		name: agent.name ?? '',
		apiKey: agent.apiKey ?? '',
		description: agent.description ?? '',
		embeddingModel: agent.embeddingId,
		conversationalModels: agent.conversationlId,
		llmPercentage: parseFloat(agent.conversational?.temperature || 0),
		maxTokens: parseInt(agent.conversational?.maxTokens || 0),
		prompt: agent.promptId
	}
	
	await nextTick()
	refFormConfig.value?.setValues(module.value)
}

async function onHandleConfig() {
	const payload = {
    	state: module.value.state,
		name: module.value.name,
		apiKey: module.value.apiKey,
		description: module.value.description,
		embeddingId: module.value.embeddingModel,
		conversationalId: module.value.conversationalModels,
		promptId: module.value.prompt
	};
	
	const serviceCall = agentIdToEdit.value 
		? () => Service.updateAgentIa(agentIdToEdit.value, payload)
		: () => Service.createAgentIa(payload);
	
	const { data, error } = await request(serviceCall);
	
	if (error) {
		console.error('Error al guardar:', error);
		return;
	}
	
	if (agentIdToEdit.value && module.value.state === 1) {
		await request(() => Service.toggleState(agentIdToEdit.value));
	}
	
	refModalHandleConfig.value.close();
	
	agentIdToEdit.value = null;
	
	emit('success');
}

function openModalManageEmbeddings() {
    refModalManageEmbeddings.value.open()
}

function open() {
    identifyModal.value = true
    agentIdToEdit.value = null
    
    refFormConfig.value?.resetForm()
    
    module.value = {
        state: 0,
        name: '',
        apiKey: '',
        description: '',
        embeddingModel: null,
        conversationalModels: null,
        llmPercentage: 0,
        maxTokens: 0,
        prompt: null
    }
    
	refModalHandleConfig.value.open()
}

async function openEdit(agentData) {
    
    identifyModal.value = false
    agentIdToEdit.value = agentData.idAgent
    
	refModalHandleConfig.value.open()
    
    await nextTick()
    
    await loadAgentData(agentData.idAgent)
}

function close() {
    agentIdToEdit.value = null
    refModalHandleConfig.value.close()
}

const emit = defineEmits(['success'])

defineExpose({
	open,
    close,
    openEdit
})
</script>

<style>
.modal-full-popper {
	z-index: 99999 !important;
}
</style>