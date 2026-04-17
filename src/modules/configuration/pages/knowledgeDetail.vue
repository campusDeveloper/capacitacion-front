<template>
    <Navbar   :actionBack="goBack"
        contentBtn="Crear categoría" :actionBtn="openCreateCategory" />
    <section class="vstack w-full h-full">
        <el-scrollbar view-class="w-full ms-10 pt-10 pb-[150px]">
            <div class="d-middle rounded-lg gap-x-5 text-primary px-6 py-4 min-h-[132px] mb-5 w-[1218px]">
                <img src="/img/illustrations/conocimiento.svg" alt="" class="size-[120px]">
                <p class="f-t-12 leading-[137%]">Configura los estados de interés para clasificar a los leads según su
                    intención de compra. Esta información ayuda a enfocar los esfuerzos comerciales en las oportunidades
                    con mayor probabilidad de conversión.</p>
            </div>
            <div class="flex flex-col gap-y-8">
                <cardCategory  v-for="category in headquarterDetail.headquarterKnowledges"
                    :key="category.idKnowledge" :category="category" 
                    @openEdit="openEditCategory($event)" @onDelete="onDeleteCategory($event)"
                    @onChangeState="onChangeState($event)" />
            </div>
        </el-scrollbar>
    </section>
    <ModalForm ref="refModalManageCategory" buttonsClass="!w-[100px]" cancel="Cancelar"
        :title="isCreate ? 'Crear categoría' : 'Editar categoría'" width="382"
        :initial-values="modelCategory" :action="isCreate ? 'Crear' : 'Guardar'"
        :onAction="isCreate ? createHeadquarterKnowledge : updateHeadquarterKnowledgeById" destroyOnClose>
        <p class="f-t-14">Agrega un título para la categoría</p>
        <Field v-slot="{ field, errorMessage }" name="title" label="titulo" rules="required">
            <p class="f-tm-14 mt-4 pb-1">Título</p>
            <el-input v-model="modelCategory.title" placeholder="Agrega un título" size="large" v-bind="field" />
            <Error server="field" :local="errorMessage" v-bind="field" />
        </Field>
        <Field v-slot="{ field, errorMessage }" name="description" label="descripcion" rules="required">
            <p class="f-tm-14 mt-4 pb-1">Descripción</p>
            <el-input v-model="modelCategory.description" placeholder="Descripción" size="large" v-bind="field" />
            <Error server="field" :local="errorMessage" v-bind="field" />
        </Field>
    </ModalForm>
    <Modal ref="refModalDeleteCategory" type="danger" action="Eliminar" cancel="Cancelar" title="Eliminar categoría" width="362" :onAction="deleteHeadquarterKnowledgeById">
        <p>¿Deseas eliminar esta categoría? <br /> Esta acción es irreversible</p>
    </Modal>
    <Modal ref="refModalActiveCategory" title="Activar categoría" action="Activar" cancel="Cancelar" width="360" :onAction="() => updateHeadquarterKnowledgeStateById(true)">
        <p>¿Deseas activar esta categoría? <br/>Al hacerlo, se habilitarán sus funciones en todo el sistema</p>
    </Modal>
    <Modal ref="refModalInactiveCategory" type="danger" title="Inactivar categoría" action="Inactivar" cancel="Cancelar" width="360" woIcon :onAction="updateHeadquarterKnowledgeStateById">
        <p>¿Deseas inactivar esta categoría? <br/>Al hacerlo, se inhabilitarán sus funciones en todo el sistema</p>
    </Modal>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Field } from 'vee-validate';
import { request } from "@request"
import cardCategory from '../components/cardCategory.vue'

// Routers
const router = useRouter();
const route = useRoute()

// Refs
const refModalManageCategory = ref();
const refModalDeleteCategory = ref();
const refModalActiveCategory = ref();
const refModalInactiveCategory = ref();

const isCreate = ref(true);

const idHeadquarter = 1

const idKnowledgeRef = ref(null)
const modelCategory = ref({
    title: null,
    description: null
})

const loading = ref(false)

const headquarterDetail = ref(
    {
        headquarterKnowledges: [
            {
                idKnowledge: 1,
                title: 'Conocimiento 1',
                description: 'Descripción del conocimiento 1',
                state: 1,
                docs: []
            },
            {
                idKnowledge: 2,
                title: 'Conocimiento 2',
                description: 'Descripción del conocimiento 2',
                state: 0,
                docs: []
            },
            {
                idKnowledge: 3,
                title: 'Conocimiento 3',
                description: 'Descripción del conocimiento 3',
                state: 1,
                docs: []
            }
        ]
    }
)


// Handlers
function openCreateCategory() {
   
    refModalManageCategory.value.open()
}

function openEditCategory() {
   
    refModalManageCategory.value.open()
}

function onDeleteCategory() {
    
    refModalDeleteCategory.value.open()
}

function onChangeState() {

    if ( 1) {
        refModalInactiveCategory.value.open()
    } else {
        refModalActiveCategory.value.open()
    }
}

/* Functions */
function goBack() {
    router.go(-1)
}
</script>
