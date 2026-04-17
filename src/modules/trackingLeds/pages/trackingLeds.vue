<template>
	<section class="vstack overflow-hidden h-full">
		<Navbar v-model="search" name="Seguimiento de leads" showInput />
		<div class="vstack overflow-hidden h-full px-6 pt-6 pb-2">
			<div class="flex text-black-300 f-tm-14 items-end overflow-hidden z-[2] min-h-[61px] gap-x-4">
				<p class="f-tm-16 text-mid-gray-600 me-auto">Lista de leads</p>
				<div class="w-[241px]">
					<p class="pb-1">Desde-hasta</p>
					<el-date-picker :disabled="loading" v-model="filters.startEnd" type="daterange" start-placeholder="Desde"
						end-placeholder="Hasta" class="!w-full" />
				</div>
				<div class="w-[210px]">
					<p class="pb-1">Comercial / Agente</p>
					<el-select :disabled="loading" v-model="filters.idUserAssigned" placeholder="Seleccionar" popper-class="!w-[210px]" clearable>
						<el-option v-for="item in optionsUsersAgent" :key="item.idUser" :label="item.name"
							:value="item.idUser">
						</el-option>
					</el-select>
				</div>
				<el-tooltip :disabled="loading" content="Exportar" placement="top">
					<Button type-style="secondary" class="!p-0" @click="handleExportFile">
						<i class="icon-document-download !text-xl" />
					</Button>
				</el-tooltip>
				<el-tooltip content="Filtros" placement="top">
					<Button type-style="tertiary" class="!p-0" @click="onToggleFilter">
						<i class="icon-setting-3 !text-xl" />
					</Button>
				</el-tooltip>
			</div>
			<div :class="['transition-all ease-linear duration-150 my-3', showFilter ? 'min-h-[61px] max-h-[61px] opacity-100' : 'min-h-[0px] max-h-[0px] opacity-0']">
				<div :class="['flex justify-end items-end gap-x-4 f-tm-14 overflow-hidden min-h-[61px]']">
					<div class="w-[182px]">
						<p class="pb-1">Seguimiento</p>
						<el-select :disabled="loading" v-model="filters.idState" placeholder="Seleccionar" popper-class="!w-[210px]"
							clearable>
							<el-option v-for="item in optionsTrackingStates" :key="item.idTracking" :label="item.name"
								:value="item.idTracking">
							</el-option>
						</el-select>
					</div>
					<div class="w-[182px]">
						<p class="pb-1">Estado interés </p>
						<el-select :disabled="loading" v-model="filters.idOpportunityState" placeholder="Seleccionar" popper-class="!w-[210px]"
							clearable>
							<el-option v-for="item in optionsStateInterest" :key="item.id"
								:label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="w-[182px]">
						<p class="pb-1">Sede de interés</p>
						<el-select :disabled="loading" v-model="filters.idHeadquarter" placeholder="Seleccionar" popper-class="!w-[210px]" 
							clearable>
							<el-option v-for="item in optionsHeadquarter" :key="item.idHeadquarter"
								:label="item.name" :value="item.idHeadquarter" class="!-fit">
								<p>{{ item.name }}</p>
							</el-option>
						</el-select>
					</div>
					<Button :disabled="loading" class="!w-[86px]" @click="onFilterData">Filtrar</Button>
				</div>
			</div>
			<el-table :data="filteredOpportunities">
				<el-table-column label="Comentarios" width="60" fixed align="center">
					<template #header>
						<i class="icon-message text-xl text-[rgb(var(--xx-color-icons-primary))] cursor-pointer" />
					</template>
					<template #default="scope">
						<div class="d-middle-center h-[40px]">
							<el-badge :value="scope.row.countComments" class="custom-badge">
								<i class="icon-message text-xl text-blue-s-500 cursor-pointer"
									@click="openModalComments(scope.row)" />
							</el-badge>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Nombre" prop="name" width="165" fixed />
				<el-table-column label="Teléfono" prop="phone" width="130" fixed />
				<el-table-column label="Categoría" width="95" align="center" fixed>
					<template #default="scope">
						<p>A</p>
					</template>
				</el-table-column>
				<el-table-column label="Sede de interés" width="150" align="center" fixed>
					<template #default="scope">
						<p>{{ scope.row.headquarterName ?? "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Estado interés" prop="idOpportunityState" width="190">
					<template #default="scope">
						<SelectDropdown  v-model="scope.row.id" :options="optionsStateInterest" 
							@change="onChangeState($event, scope.row)" />
					</template>
				</el-table-column>
				<el-table-column label="Fecha de interés" width="210">
					<template #default="scope">
						<p>{{ DateFormat(scope.row.checkInDate, 'DD MMM YYYY') }} - {{
							DateFormat(scope.row.checkOutDate, 'DD MMM YYYY') }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Ley Hotelera" width="85" align="center">
					<template #default="scope">
						<p>{{ scope.row.hotelLaw ?? "Si" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Tipo alojamiento" width="115">
					<template #default="scope">
						<p>{{ scope.row.roomType ?? "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Cant. personas" prop="guests" width="115" align="center">
					<template #default="scope">
						<p>{{ scope.row.guests ?? "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Tipo de escalamiento" width="165">
					<template #default="scope">
						<p>{{ scope.row.exception ?? "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Responsable" width="225">
					<template #default="scope">
						<div class="d-middle">
							<p class="!me-auto w-[146px]">{{ scope.row.userAssigned?.name ?? 'Sin responsable' }}</p>
							<el-tooltip v-if="scope.row.userAssigned?.paymentAgent" content="Agente de pago"
								placement="top">
								<i class="icon-dollar-circle text-green-s-500 text-xl" />
							</el-tooltip>
							<i v-if="scope.row.userAssigned" class="icon-edit-2 text-xl cursor-pointer"
								@click="openEditSpecializedAgent(scope.row)" />
							<i v-else class="icon-add-circle text-2xl cursor-pointer"
								@click="openAssignSpecializedAgent(scope.row)" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Última interacción" width="185">
					<template #default="scope">
						<p>{{ scope.row.lastConnection ? DateFormat(scope.row.lastConnection, 'DD MMM YYYY hh:mm a') :
							"-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Estados de seguimiento" prop="idOpportunityTracking" width="275">
					<template #default="scope">
						<SelectStatusFollowUp v-if="optionsTrackingStates.length > 0" :disabled="loading" isOutline v-model="scope.row.idOpportunityTracking" :options="optionsTrackingStates" 
							@change="onChangeTracking(scope.row, $event)" />
					</template>
				</el-table-column>
				<el-table-column label="Últ. seguimiento" width="140">
					<template #default="scope">
						<p>{{ scope.row.lastOpportunityTracking ? DateFormat(scope.row.lastOpportunityTracking, 'DD MMM YYYY') : "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Historial" width="95" align="center">
					<template #default="{ row }">
						<i class="icon-document-text text-xl text-white-700 cursor-pointer" @click="openHistory(row)" />
					</template>
				</el-table-column>
			</el-table>
		</div>
		<modalSpecializedAgent ref="refModalHandleAgent" @submitForm="handleActionAgent" />
		<modalHistory ref="refModalHistory" />
		<modalComments ref="refModalComments" @increase-comment="handleIncreaseComment"/>
	</section>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue'
import { DateFormat } from '@/util/dateFormat.js'
import { request } from "@request"
import * as XLSX from 'xlsx';
import SelectStatusFollowUp from '@comp/SelectStatusFollowUp.vue'
import SelectDropdown from '@comp/SelectDropdown.vue'
import modalSpecializedAgent from '../partials/modalSpecializedAgent.vue'
import modalHistory from '../partials/modalHistory.vue'
import modalComments from '../partials/modalComments.vue'

const refModalHandleAgent = ref()
const refModalHistory = ref()
const refModalComments = ref()

const loading = ref(false)
const search = ref('')
const showFilter = ref(false)

const filters = ref({
	startEnd: null,
	idState: null,
	idUserAssigned: null,
	idOpportunityState: null,
	idHeadquarter: null,
})

const oppotunities = ref([
    {
        id: 1,
        name: "Opportunity 1",
        status: "Open",
        createdAt: "2023-10-01",
        description: "First opportunity for tracking LEDs.",
        idState: 1,
        idUserAssigned: 2,
        idOpportunityState: 3,
        idHeadquarter: 4,
    },
    {
        id: 2,
        name: "Opportunity 2",
        status: "In Progress",
        createdAt: "2023-10-05",
        description: "Second opportunity for tracking LEDs.",
        idState: 2,
        idUserAssigned: 3,
        idOpportunityState: 1,
        idHeadquarter: 2,
    },
    {
        id: 3,
        name: "Opportunity 3",
        status: "Closed",
        createdAt: "2023-10-10",
        description: "Third opportunity for tracking LEDs.",
        idState: 3,
        idUserAssigned: 1,
        idOpportunityState: 2,
        idHeadquarter: 3,
    },
])
const filteredOpportunities = computed(() => {
	if (!search.value) return oppotunities.value

	const searchLower = search.value.toLowerCase().trim()

	return oppotunities.value.filter((item) => {
		return item.name.toLowerCase().includes(searchLower)
	})
})

const optionsUsersAgent = ref([])

const optionsTrackingStates = ref([])

const optionsStateInterest = ref([])

const optionsHeadquarter = ref([])



function openHistory(row) {
	if (!row) return
	refModalHistory.value.open(row.id)
}

function handleIncreaseComment(value) {
	const opportunityFinded = oppotunities.value.find(c => c.id === value)

	if (opportunityFinded) opportunityFinded.countComments ++
}

function onToggleFilter() {
	showFilter.value = !showFilter.value
}

function openModalComments(row) {
	if (!row || loading.value) return
	refModalComments.value.open(row.id)
}

function openAssignSpecializedAgent(row) {
	if (!row || loading.value) return
	refModalHandleAgent.value.open(optionsUsersAgent.value, row.id, row.idUserAssigned)
}

function openEditSpecializedAgent(row) {
	if (!row || loading.value) return
	refModalHandleAgent.value.open(optionsUsersAgent.value, row.id, row.idUserAssigned, false)
}

function handleExportFile() {
	
	
}

</script>