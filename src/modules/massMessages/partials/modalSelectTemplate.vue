<template>
	<ModalRight ref="refModalSelectTemplate" title="Seleccionar plantilla" width="342">
		<el-input v-model="search" placeholder="Buscar" class="relative !w-full">
			<template #suffix>
				<Button type-style="tertiary" class="absolute right-0 !rounded-lg !p-0" @click="handleSearch">
					<i class="icon-search !text-xl" />
				</Button>
			</template>
		</el-input>
		<cardTemplate v-for="item in filteredData" :key="item.id" :selected="templateSelected?.id === item.id"
			@handleActionEye="openTemplatePreview" :data="item" class="my-3" @click="selectTempalte(item)" />
		<template #footer>
			<div class="d-middle-end gap-x-2">
				<Button type-style="secondary" class="!min-w-[93px]" @click="close">Cerrar</Button>
				<Button type-style="primary" class="!min-w-[93px]" @click="handleTemplate">Usar plantilla</Button>
			</div>
		</template>
	</ModalRight>
	<modalPreviewTemplate ref="refModalPreviewTemplate" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElNotification } from 'element-plus'
import modalPreviewTemplate from './modalPreviewTemplate.vue';
import cardTemplate from '../components/cardTemplate.vue';
import { request } from "@request";

const refModalSelectTemplate = ref()
const refModalPreviewTemplate = ref()

const search = ref('')
const templateSelected = ref(null)
const dataTemplateList = ref()


function handleSearch() {
}

function openTemplatePreview() {
	refModalPreviewTemplate.value.open()
}

function handleTemplate() {
	
}

function selectTempalte() {
}

async function open() {
	refModalSelectTemplate.value.open()
}

function close() {
	refModalSelectTemplate.value.close()
}

defineExpose({
	open,
	close,
})

</script>