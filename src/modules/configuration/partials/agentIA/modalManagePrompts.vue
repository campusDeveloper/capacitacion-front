<template>
    <ModalRight ref="refModalManagePrompts" title="Gestionar prompts" width="464" destroyOnClose>
        <div class="vstack">
            <div class="w-full py-4 px-5 min-h-[246px] bg-[rgb(var(--xx-color-surface-tertiary))] rounded-xl">
                <Form @submit="handleSubmit"  v-slot="{ resetForm }">
                    <p class="f-tm-14">Título</p>
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
                        <Button type="submit" class="!w-[85px] mt-3 self-end"@click="formReset = resetForm">{{ 'Agregar' }}</Button>
                    </div>
                </Form>
            </div>
            <el-scrollbar>
                <p class="mt-8 f-tm-18 text-mid-gray-600">Lista de prompts</p>
                <div v-for="item in prompts" :key="item.idAgentPrompt" class="w-full max-h-[182px] p-3 pl-4 bg-dark-gray-50 mt-4 rounded-lg shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div class="d-middle-bt">
                        <h1 class="f-t-14 text-mid-gray-600">{{ item.name}}</h1>
                        <div class="d-middle gap-0.5">
                            <!-- <i class="cursor-pointer icon-trash text-[rgb(var(--xx-color-icons-danger))]"/> -->
                        </div>
                    </div>
                    <p class="f-t-12 mt-3 text-primary line-clamp-5">
                        Siempre mantienes un tono empático y paciente, y te aseguras de que el usuario entienda cada paso de la solución
                    </p>
                    <p class="f-tl-10 mt-4">Ult. act. {{ DateFormat(new Date(), 'DD MMM YYYY')}}</p>
                </div>
            </el-scrollbar>
        </div>
    </ModalRight>
</template>

<script setup>
import { DateFormat } from '@/util/dateFormat';
import { Field, Form } from 'vee-validate';
import { onBeforeMount, ref } from 'vue';
import * as Service from '../../services/agentConfig'
import { request } from '@request'

const refModalManagePrompts = ref();


const prompts= ref([])
const formReset = ref(null);
const module = ref({
    title: null,
    description: null
})
onBeforeMount(async ()=>{
	//await getListPrompts()
})
// Functions

async function getListPrompts(){
	const { data, error } = await request(()=> Service.getListPrompts());
	if(error) return 
	prompts.value = data?.data ?? []
}

async function createPrompts(){
	const payload = { 
		name: module.value.title,
		description: module.value.description
	}
	const { data, error } = await request(()=> Service.createPrompts(payload));
	if(error){
		return false;
	}
	resetModel();
	await getListPrompts();
	return true;
}
async function handleSubmit() {
    const success = await createPrompts();
	    if (success && formReset.value) {
        formReset.value();
    }
}
function resetModel() {
	module.value = {
		title: null,
		description: null
	}
}

// Functions
function open() {
    refModalManagePrompts.value.open()
}

function close() {
    refModalManagePrompts.value.close()
}

defineExpose({
    open,
    close
})
</script>
