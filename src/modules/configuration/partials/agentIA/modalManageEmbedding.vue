<template>
    <ModalRight ref="refModalManageEmbedding" title="Gestionar embeddings" width="464" destroyOnClose>
        <div class="vstack">
            <div class="w-full py-4 px-5 min-h-[246px] bg-[rgb(var(--xx-color-surface-tertiary))] rounded-xl">
                <Form @submit="addEmbedding" ref="refFormEmbedding">
                    <p class="f-tm-14">Título del modelo de embedding</p>
                    <Field v-slot="{ field, errorMessage }" name="title" label="título" rules="required">
                        <el-input v-model="module.title" placeholder="Agrega un título" class="!w-full mt-1" v-bind="field" />
						<Error server="titulo" :local="errorMessage" v-bind="field" />
                    </Field>
                    <p class="mt-3 f-tm-14">Descripción</p>
                    <Field v-slot="{ field, errorMessage }" name="description" label="descripción" rules="required">
                        <el-input v-model="module.description" type="textarea" placeholder="Agrega una descripción" class="!w-full mt-1" v-bind="field" />
						<Error server="description" :local="errorMessage" v-bind="field" />
                    </Field>
                    <div class="w-full d-middle-end">
                        <Button type="submit" class="!w-[85px] mt-3 self-end">{{ 'Agregar' }}</Button>
                    </div>
                </Form>
            </div>
            <el-scrollbar>
                <p class="mt-8 f-tm-18 text-mid-gray-600">Lista de embeddings</p>
                <div v-for="item in embeddings" :key="item.idAgentEmbedding" class="w-full min-h-[107px] p-3 pl-4 bg-dark-gray-50 mt-3 rounded-lg shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div class="d-middle-bt">
                        <h1 class="f-t-14 text-mid-gray-600">{{ item.modelName }}</h1>
                        <!-- <i class="cursor-pointer icon-trash text-[rgb(var(--xx-color-icons-danger))]"/> -->
                    </div>
                    <p class="f-t-12 mt-1 !w-[311px] text-primary line-clamp-4">{{ item.description }}</p>
                </div>
            </el-scrollbar>
        </div>
    </ModalRight>
</template>

<script setup>
import { Field, Form } from 'vee-validate';
import { onBeforeMount, ref } from 'vue';
import * as Service from '../../services/agentConfig'
import { request } from '@request'

const refModalManageEmbedding = ref();
const refFormEmbedding = ref();

const module = ref({
    title: null,
    description: null
})
const embeddings = ref ([])
onBeforeMount(async ()=>{
	//await getListEmbeddings();
})
// Functions

async function getListEmbeddings(){
	const { data, error } = await request(() => Service.getListEmbeddings());
	if (error) return 
	embeddings.value = data?.data ?? []
}

async function createEmbeddings(){
	const payload = { 
		modelName: module.value.title,
		description: module.value.description
	}
	const { data, error } = await request(()=> Service.createEmbedding(payload));
	if(error){
		return false;
	}
	resetModel();
	await getListEmbeddings();
	return true;
}

async function addEmbedding() {
    const success = await createEmbeddings();
	    if (success && formReset.value) {
        formReset.value();
    }
}

// function addEmbedding() {
// 	refFormEmbedding.value.resetForm()
// 	module.value = {
// 		title: '',
// 		description: ''
// 	}
// }
function resetModel() {
	module.value = {
		title: null,
		description: null
	}
}
function open() {
    refModalManageEmbedding.value.open()
}

function close() {
    refModalManageEmbedding.value.close()
}

defineExpose({
    open,
    close
})
</script>
