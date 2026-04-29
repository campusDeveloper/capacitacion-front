<template>
    <div :class="['w-[1218px] min-h-[108px] bg-[rgb(var(--xx-color-surface-tertiary))] pt-5 pr-5 pl-6 rounded-lg border border-transparent', category.state ? '!bg-[rgb(var(--xx-color-surface-primary))] !border-[rgb(var(--xx-color-surface-secondary))] !shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),_0_1px_3px_0_rgba(0,0,0,0.1)]' : '', category.docs.length === 0 ? 'pb-2' : 'pb-6']">
        <div class="d-middle gap-y-3">
            <section class="max-w-[828px] flex flex-col gap-y-3">
                <h1 class="f-ts-16">{{ category.title }}</h1>
                <p class="f-t-12">{{ category.description }}</p>
            </section>
            <section class="d-middle ms-auto gap-[16px] !self-start">
                <button class="d-middle-center gap-3 f-tm-14 bg-[rgb(var(--xx-color-button-secondary-rest))] px-1 py-1 pr-4 rounded text-white-100" @click="openCreateKnowledge"><i class="icon-add text-xl"></i>Agregar conocimiento</button>
                <el-switch v-model="category.state" size="small" :active-value="1" :inactive-value="0" :before-change="openChangeState"/>
                <DropdownOptions :options="options" :params="category" size-icon="!text-primary text-2xl"
							placement="bottom"/>
            </section>
        </div>
        <div  class="d-middle gap-x-3 mt-8 flex-wrap gap-y-3">
            <cardKnowledge v-for="doc in category.docs" :key="doc.idDoc" :data="doc"
                @on-delete="onDeleteDocument" @on-change-state="onChangeState" />
        </div>
    </div>
    <ModalRight ref="refModalManageKnowledge" title="Agregar conocimiento" width="380" destroyOnClose>
        <p class="f-t-14 mt-4 mb-10">Agrega un título para el conocimiento y adjunta el archivo a continuación</p>
        <Form ref="refFormCreateKnowledge">
            <Field v-slot="{ field, errorMessage }" name="name" label="título" rules="required">
    			<p class="text-[rgb(var(--xx-color-text-primary))] f-tm-14 mt-3 pb-1">Título</p>
                <el-input v-model="document.name" placeholder="Agrega un título" size="large" v-bind="field" />
                <Error server="title" :local="errorMessage" v-bind="field" />
            </Field>
			<Field v-slot="{ field, errorMessage }" name="file" label="archivo" rules="required">
				<DragAndDropFile ref="refDragAndDrop" title="Adjunta el documento" buttonClass="!w-[110px] !text-[11px]" subDescription="Peso máximo 10MB" class="mt-8 w-full" v-model="document.file" description="Archivos con formato .PDF" accept="application/pdf" v-bind="field" width="342" />
				<Error server="nombre" :local="errorMessage" v-bind="field" />
			</Field>
            <div v-if="document.file?.name" class="d-middle min-h-[34px] bg-mid-gray-50 rounded-xl w-fit mt-2 px-3 gap-x-1">
                <p class="text-xs text-black-700">{{ document.file.name }} </p>
                <i class="icon-close-circle text-black-300 cursor-pointer" @click="deleteFile" />
            </div>
        </Form>
        <template #footer>
            <div class="d-middle-end gap-x-3">
                <Button class="!w-[93px]" type-style="secondary"
                    @click="refModalManageKnowledge.close()">Cancelar</Button>
                <Button class="!w-[93px]" type-style="primary" @click="createDocByKnowledgeId">{{ isCreateKnowledge ? 'Crear' : 'Guardar'}}</Button>
            </div>
        </template>
    </ModalRight>
    <Modal ref="refModalDeleteKnowledge" type="danger" title="Eliminar conocimiento" width="372" action="Eliminar" cancel="Cancelar" :onAction="deleteDocById">
        <p>¿Deseas eliminar este conocimiento? <br/>Esta acción es irreversible.</p>
    </Modal>
    <Modal ref="refModalActiveKnowledge" title="Activar conocimiento" action="Activar" cancel="Cancelar" width="360" :onAction="() => updateDocStateById(true)">
        <p>¿Deseas activar este conocimiento? <br/>Al hacerlo, se habilitarán sus funciones en todo el sistema</p>
    </Modal>
    <Modal ref="refModalInactiveKnowledge" type="danger" title="Inactivar conocimiento" action="Inactivar" cancel="Cancelar" width="360" woIcon :onAction="updateDocStateById">
        <p>¿Deseas inactivar este conocimiento? <br/>Al hacerlo, se inhabilitarán sus funciones en todo el sistema</p>
    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import cardKnowledge from './cardKnowledge.vue'
import { Field, Form } from 'vee-validate';
import { request } from "@request"
import DragAndDropFile from '@comp/DragAndDropFile.vue';
import {
    createKnowledgeDocByIdKnowledge,
    changeDocStateById,
    deleteDocById as deleteDocByIdService,
} from '../services/knowledgeService';

//refs
const refModalManageKnowledge = ref();
const refDragAndDrop = ref();
const refFormCreateKnowledge = ref();
const refModalDeleteKnowledge = ref();
const refModalActiveKnowledge = ref();
const refModalInactiveKnowledge = ref();

const isCreateKnowledge = ref(false)

const idDocRef = ref(null)
const document = ref({
    name: null,
    file: null,
})

const loading = ref(false)

const emit = defineEmits(['openEdit', 'onDelete', 'onChangeState'])

const props = defineProps({
    category: {
        type: Object,
        required: true
    }
})

const options = ref([
    { option: 'Editar', action: openEditCategory, icon: 'icon-edit-2' },
    { option: 'Eliminar', action: openDeleteCategory, icon: 'icon-trash', danger: true },
])

// Functions

function deleteFile() {
    refDragAndDrop.value.deleteElement()
}

// Handlers
function openCreateKnowledge() {
    isCreateKnowledge.value = true
    idDocRef.value = null
    document.value = { name: null, file: null }
    refModalManageKnowledge.value.open()
}

function onDeleteDocument(doc) {
    idDocRef.value = doc?.idDoc
    refModalDeleteKnowledge.value.open()
}

function onChangeState(doc) {
    idDocRef.value = doc?.idDoc

    console.log("DOC:", doc)
    console.log("STATE:", doc?.state)

    if (Number(doc?.state) === 1) {
        refModalInactiveKnowledge.value.open()
    } else {
        refModalActiveKnowledge.value.open()
    }
}

function openChangeState() {
    emit("onChangeState", props.category)
    return false
}

function openEditCategory() {
    emit('openEdit', props.category)
}

function openDeleteCategory() {
    emit('onDelete', props.category)
}

async function createDocByKnowledgeId() {
    const valid = await refFormCreateKnowledge.value?.validate()
    if (!valid?.valid) return false

    const payload = {
        name: document.value.name,
        file: document.value.file,
    }

    const { error } = await request(
        () => createKnowledgeDocByIdKnowledge(props.category.idKnowledge, payload),
        true
    )
    if (error) return false
    refModalManageKnowledge.value.close()
    document.value = { name: null, file: null }
    emit('onChangeState', { type: 'doc' })
    return true
}

async function deleteDocById() {
    const { error } = await request(
        () => deleteDocByIdService(idDocRef.value),
        true
    )
    if (error) return false
    refModalDeleteKnowledge.value.close()
    emit('onChangeState', { type: 'doc' })
    return true
}

async function updateDocStateById() {
    const { error } = await request(
        () => changeDocStateById(idDocRef.value),
        true
    )
    if (error) return false
    refModalActiveKnowledge.value.close()
    refModalInactiveKnowledge.value.close()
    emit('onChangeState', { type: 'doc' })
    return true
}
</script>