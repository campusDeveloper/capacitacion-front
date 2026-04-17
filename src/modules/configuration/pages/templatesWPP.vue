<template>
	<section class="vstack overflow-hidden w-full h-full">
		<Navbar name="Plantillas de Whatsapp" contentBtn="Crear plantilla" v-model="search"
			:showInput="dataListTemplate.length > 0" :action-back="goBack" :actionBtn="openCreateTemplate" />
		<EmptyView v-if="dataListTemplate.length === 0"
			:data="{ title: 'Sin plantillas', description: 'Haz click en el botón “Crear plantilla” para iniciar' }" />
		<el-scrollbar v-else view-class="flex flex-wrap gap-6 px-8 py-12">
			<cardTemplateWpp v-for="item in filteredTemplates" :key="item.Id" :data="item"
				@handleChangeState="toggleState" @openDelete="openDeleteTemplate" @click="openPreviewTemplate(item)" />
		</el-scrollbar>
		<Modal ref="refModalActiveTemplate" action="Activar" cancel="Cancelar" title="Activar plantilla" width="360"
			:onAction="handleActiveTemplate">
			<p>¿Deseas activar esta plantilla? <br /> Al hacerlo, se habilitarán sus funciones en todo el sistema</p>
		</Modal>
		<Modal ref="refModalInactiveTemplate" type="danger" action="Inactivar" cancel="Cancelar"
			title="Inactivar plantilla" width="360" woIcon :onAction="handleInactiveTemplate">
			<p>¿Deseas inactivar esta plantilla? <br /> Al hacerlo, se inhabilitarán sus funciones en todo el sistema
			</p>
		</Modal>
		<Modal ref="refModalDeleteTemplate" type="danger" action="Eliminar" cancel="Cancelar" title="Eliminar plantilla"
			width="360" :onAction="handleDeleteTemplate">
			<p>¿Deseas eliminar esta plantilla? <br /> Esta acción es irreversible</p>
		</Modal>
		<modalPreviewTemplate ref="refModalPreviewTemplate" />
		<modalCreateTemplate ref="refModalCreateTemplate" @createTemplate="loadTemplates" />
	</section>
</template>
<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter } from 'vue-router';
import cardTemplateWpp from '../components/cardTemplateWpp.vue';
import modalPreviewTemplate from '../partials/modalPreviewTemplate.vue';
import modalCreateTemplate from '../partials/modalCreateTemplate.vue';
import { request } from "@request";

const refModalActiveTemplate = ref()
const refModalInactiveTemplate = ref()
const refModalPreviewTemplate = ref()
const refModalDeleteTemplate = ref()
const refModalCreateTemplate = ref()
const loading = ref(false);
const selectedTemplate = ref(null)
const currentDeleteId = ref(null)
const currentToggleId = ref(null)

const router = useRouter();
const search = ref('')
const dataListTemplate = ref([]);

const options = ref([
	{ option: 'Eliminar', action: openDeleteTemplate, icon: 'icon-trash', danger: true },
])

function goBack() {
	router.push({ name: 'configuration.main' })
}

function openCreateTemplate() {
	refModalCreateTemplate.value.open()
}

function openPreviewTemplate() {
	refModalPreviewTemplate.value.open()
}

function openDeleteTemplate() {
	refModalDeleteTemplate.value.open()
}


function toggleState() {
	if (1) {
		refModalActiveTemplate.value.open()
	} else {
		refModalInactiveTemplate.value.open()
	}
}

async function handleActiveTemplate() {
	
}

async function handleInactiveTemplate() {
	
}

</script>