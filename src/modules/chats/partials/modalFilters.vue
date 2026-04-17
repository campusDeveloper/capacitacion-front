<template>
	<ModalRight ref="refModalFilters" title="Filtros" width="400">
		<div class="vstack gap-y-7 text-[rgb(var(--xx-color-text-secondary))]]">
			<div class="w-full">
				<p class=" f-tm-14 pb-1">Sede de interés</p>
				<el-select clearable v-model="filter.idHeadquarter" placeholder="Seleccionar">
					<el-option v-for="item in optionsHeadquarters" :key="item.idHeadquarter" :label="item.name" :value="item.idHeadquarter"/>
				</el-select>
			</div>
			<div class="w-full">
				<p class=" f-tm-14 pb-1">Escalamiento</p>
				<el-select clearable v-model="filter.idException" placeholder="Seleccionar">
					<el-option v-for="item in optionsExceptions" :key="item.idException" :label="item.name" :value="item.idException"/>
				</el-select>
			</div>
			<div class="w-full">
				<p class=" f-tm-14 pb-1">Seguimiento</p>
				<el-select clearable v-model="filter.idTracking" placeholder="Seleccionar">
					<el-option v-for="item in optionsTracking" :key="item.idTracking" :label="item.name" :value="item.idTracking"/>
				</el-select>
			</div>
		</div>
		<template #footer>
            <div class="d-middle-end gap-x-3">
                <Button class="!w-[93px]" type-style="secondary"
                    @click="refModalFilters.close()">Cancelar</Button>
                <Button class="!w-[93px]" type-style="primary" @click="handleFilterChats">Filtrar</Button>
            </div>
        </template>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { request } from "@request";

const props = defineProps({
	filter: {
		type: Object,
		required: true
	}
})

const refModalFilters = ref()

const loading = ref(false)

const optionsHeadquarters = ref([
	{ "idHeadquarter": 1001, "name": "Sede recreacional" }
])

const optionsExceptions = ref([
	{ "idException": 1001, "name": "Llamada" }
])

const optionsTracking = ref([
	{ "idTracking": 1001, "name": "IA no sabe" }
])

const emit = defineEmits(['filterChats'])

/* Functions */
function handleFilterChats() {
	emit('filterChats')
}

/* Async Functions */
async function open() {
	refModalFilters.value.open()
}

defineExpose({
	open
})

</script>