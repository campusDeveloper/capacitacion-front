<template>
    <ModalRight ref="refModalManageLlm" title="Gestionar modelos LLM" width="464" destroyOnClose>
        <div class="vstack">
            <div class="w-full py-4 px-5 min-h-[246px] rounded-xl bg-[rgb(var(--xx-color-surface-tertiary))]">
                <Form @submit="handleSubmit" v-slot="{ resetForm }">
                    <p class="f-tm-14">Título del modelo conversacional</p>
                    <Field v-slot="{ field, errorMessage }" name="title" label="título" rules="required">
                        <el-input v-model="module.title" placeholder="Agrega un título" class="!w-full mt-1" v-bind="field" />
						<Error server="titulo" :local="errorMessage" v-bind="field" />
                    </Field>
                    <p class="mt-3 f-tm-14">Descripción</p>
                    <Field v-slot="{ field, errorMessage }" name="description" label="descripción" rules="required">
                        <el-input v-model="module.description" type="textarea" placeholder="Agrega una descripción" class="!w-full mt-1" v-bind="field" />
						<Error server="description" :local="errorMessage" v-bind="field" />
                    </Field>
                    <Field v-slot="{ field, errorMessage }" name="temperature" label="temperatura" rules="required">
                        <div class="d-middle-bt max-w-[392px] mt-4">
                            <div class="text-mid-gray-600 w-[320px]">
                                <p class="f-tm-14">Temperatura</p>
                                <el-progress :show-text="false" :percentage="Number(module.temperature)* 100 || 0" class="mt-1 full-progress" :stroke-width="12"/>
                                <div class="d-middle-bt f-t-12 mt-1 text-primary">
                                    <p>Preciso</p>
                                    <p>Creativo</p>
                                </div>
                            </div>
                            <el-input-number :controls="false" v-model="module.temperature" class="!w-[50px]" placeholder="0.0" :max="100" :min="0" v-bind="field"/>
                        </div>
                        <Error server="temperature" :local="errorMessage" v-bind="field" />
                    </Field>
                    <Field v-slot="{ field, errorMessage }" name="maxTokens" label="limite de tokens" rules="required">
						<div class="mt-4">
                            <p class="f-tm-14">Máximo de Tokens</p>
                            <el-input-number :controls="false" v-model="module.maxTokens" placeholder="Digita la cantidad" class="!w-full mt-1" v-bind="field"/>
                            <p class="f-t-12 text-tertiary ml-4 relative">Límite de respuesta</p>
                        </div>
                        <Error server="maxTokens" :local="errorMessage" v-bind="field" />
                    </Field>
                    <div class="w-full d-middle-end">
                        <Button type="submit" class="!w-[85px] mt-3 self-end"@click="formReset = resetForm">{{ 'Agregar' }}</Button>
                    </div>
                </Form>
            </div>
            <el-scrollbar>
                <p class="mt-8 f-tm-18 text-mid-gray-600">Lista de modelos LLM</p>
                <div v-for="item in LLMs" :key="item.idAgentConversational" class="w-full min-h-[107px] p-3 pl-4 bg-dark-gray-50 mt-3 rounded-lg shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div class="d-middle-bt">
                        <h1 class="f-t-14 text-mid-gray-600">{{ item.modelName }}</h1>
                        <!-- <i class="cursor-pointer icon-trash text-[rgb(var(--xx-color-icons-danger))]"/> -->
                    </div>
                    <p class="f-t-12 mt-1 text-primary line-clamp-3">
                        Es un modelo multimodal rápido y eficiente, optimizado para respuestas en tiempo real, razonamiento ligero y procesamiento de texto e imágenes con baja latencia.
                    </p>
                    <p class="f-t-12 d-middle gap-x-2 mt-2">Temperatura<span>{{ item.temperature }}</span></p>
                    <p class="f-t-12 d-middle gap-x-2 mt-2">Máximo de Tokens<span>{{ item.maxTokens }}</span></p>
                </div>
            </el-scrollbar>
        </div>
    </ModalRight>
</template>

<script setup>
import { Field, Form } from 'vee-validate';
import { onBeforeMount, ref } from 'vue';
import { request } from '@request'
import * as Service from '../../services/agentConfig'
const refModalManageLlm = ref();
const LLMs= ref([])
const formReset = ref(null);
const module = ref({
    title: null,
    description: null,
    percentage: null,
    maxTokens: null,
})

onBeforeMount(async ()=>{
	//await getListLLM()
})

// Functions
async function getListLLM(){
	const { data, error } = await request(() =>Service.getListLLM());
	if (error) return 
	LLMs.value = data?.data ?? []
}
async function createLLMs(){
	const payload = { 
		modelName: module.value.title,
		description: module.value.description,
		temperature: module.value.temperature,
		maxTokens: module.value.maxTokens
	}
	const { data, error } = await request(()=> Service.createLLMs(payload));
	if(error){
		return false;
	}
	resetModel();
	await getListLLM();
	return true;
}

async function handleSubmit() {
    const success = await createLLMs();
	    if (success && formReset.value) {
        formReset.value();
    }
}

function resetModel() {
    module.value = {
        title: null,
        description: null,
        temperature: 0,
        maxTokens: null
    }
}


// Functions
function open() {
    refModalManageLlm.value.open()
}

function close() {
    refModalManageLlm.value.close()
}

defineExpose({
    open,
    close
})
</script>
