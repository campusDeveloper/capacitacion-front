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
					<el-select :disabled="loading" v-model="selectedUser" placeholder="Seleccionar" popper-class="!w-[210px]" clearable>
						<el-option v-for="item in users" :key="item.value" :label="item.label"
							:value="item.value">
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
						<el-select :disabled="loading" v-model="selectedTrackingParent" placeholder="Seleccionar" popper-class="!w-[210px]"
							clearable>
							<el-option v-for="item in trackingParents" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="w-[182px]">
						<p class="pb-1">Estado interés </p>
						<el-select :disabled="loading" v-model="selectedOpportunityState" placeholder="Seleccionar" popper-class="!w-[210px]"
							clearable>
							<el-option v-for="item in opportunityStates" :key="item.id"
								:label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="w-[182px]">
						<p class="pb-1">Sede de interés</p>
						<el-select :disabled="loading" v-model="selectedHeadquarter" placeholder="Seleccionar" popper-class="!w-[210px]"
							clearable>
							<el-option v-for="item in headquarters" :key="item.value"
								:label="item.label" :value="item.value" class="!-fit">
								<p>{{ item.label }}</p>
							</el-option>
						</el-select>
					</div>
					<Button :disabled="loading" class="!w-[86px]" @click="onFilterData">Filtrar</Button>
				</div>
			</div>
			<el-table :data="filteredTrackingLeads" v-loading="loading">
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
						<p>{{ scope.row.affiliateCategory }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Estado interés" prop="idOpportunityState" width="190" fixed>
					<template #default="scope">
						<SelectDropdown v-model="scope.row.idOpportunityState" :options="stateOptionsForTable" />
					</template>
				</el-table-column>
				<el-table-column label="Sede de interés" width="150" align="center">
					<template #default="scope">
						<p>{{ scope.row.headquarterName ?? '-' }}</p>
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
						<p>{{ scope.row.hotelLaw ?? 'Si' }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Tipo alojamiento" width="115">
					<template #default="scope">
						<p>{{ scope.row.roomType ?? '-' }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Cant. personas" prop="guests" width="115" align="center">
					<template #default="scope">
						<p>{{ scope.row.guests ?? '-' }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Tipo de escalamiento" width="165">
					<template #default="scope">
						<p>{{ scope.row.exception ?? '-' }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Responsable" width="225">
					<template #default="scope">
						<div class="d-middle">
							<p class="!me-auto w-[146px]">{{ scope.row.nameResponsible ?? scope.row.userAssigned?.name ?? 'Sin responsable' }}</p>
							<el-tooltip v-if="scope.row.userAssigned?.paymentAgent || scope.row.paymentAgent" content="Agente de pago"
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
						<p>{{ scope.row.lastConnection ? DateFormat(scope.row.lastConnection, 'DD MMM YYYY hh:mm a') : '--' }}</p>
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
						<p>{{ scope.row.lastConnection ? DateFormat(scope.row.lastConnection, 'DD MMM YYYY') : '-' }}</p>
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
import { ref, onMounted, watch, computed } from 'vue'
import { DateFormat } from '@/util/dateFormat.js'
import { request } from '@request'
import * as XLSX from 'xlsx'
import SelectStatusFollowUp from '@comp/SelectStatusFollowUp.vue'
import SelectDropdown from '@comp/SelectDropdown.vue'
import modalSpecializedAgent from '../partials/modalSpecializedAgent.vue'
import modalHistory from '../partials/modalHistory.vue'
import modalComments from '../partials/modalComments.vue'
import { getTrackingLeads, getHeadquarters, getUsers, getOpportunityStates, getTrackingParents } from '../services/trackingLeadsService'
import { getTrackingOpportunities } from '../../configuration/services/trackingService'

const refModalHandleAgent = ref()
const refModalHistory = ref()
const refModalComments = ref()

const loading = ref(false)
const search = ref('')
const showFilter = ref(false)
const hotFilterTimer = ref(null)
const lastRequestId = ref(0)

const filters = ref({
	startEnd: null,
	idState: null,
	idUserAssigned: null,
	idOpportunityState: null,
	idHeadquarter: null,
})

const trackingLeads = ref([])
const headquarters = ref([])
const selectedHeadquarter = ref(null)
const users = ref([])
const selectedUser = ref(null)
const opportunityStates = ref([])
const selectedOpportunityState = ref(null)
const trackingParents = ref([])
const selectedTrackingParent = ref(null)
const appliedAdvancedFilters = ref({
	idHeadquarter: null,
	startEnd: null,
})
const stateOptionsForTable = computed(() => {
	const catalog = Array.isArray(optionsStateInterest.value) ? optionsStateInterest.value : []
	const idsInCatalog = new Set(catalog.map(item => Number(item.id)))
	const missingIds = new Set()

	for (const lead of trackingLeads.value) {
		const stateId = lead?.idOpportunityState
		if (stateId == null) continue
		const idAsNumber = Number(stateId)
		if (!idsInCatalog.has(idAsNumber)) missingIds.add(idAsNumber)
	}

	const fallbackOptions = [...missingIds].map(id => ({
		id,
		name: 'Sin estado',
		color: '#909399'
	}))

	return [...catalog, ...fallbackOptions]
})
const filteredTrackingLeads = computed(() => {
	let leads = [...trackingLeads.value]

	if (appliedAdvancedFilters.value.idHeadquarter) {
		const selectedHeadquarterInfo = headquarters.value.find(
			item => item.value === Number(appliedAdvancedFilters.value.idHeadquarter)
		)

		if (selectedHeadquarterInfo?.label) {
			const normalizedName = selectedHeadquarterInfo.label.trim().toLowerCase()
			leads = leads.filter(item =>
				(item?.headquarterName ?? '').trim().toLowerCase() === normalizedName
			)
		}
	}

	if (selectedTrackingParent.value) {
		leads = leads.filter(item => {
			const trackingValue = Number(item?.idOpportunityTracking)
			const selectedValue = Number(selectedTrackingParent.value)
			if (trackingValue === selectedValue) return true

			for (const parent of optionsTrackingStates.value) {
				if (Number(parent?.idTracking) !== selectedValue) continue
				const hasChild = (parent?.children ?? []).some(
					child => Number(child?.idTrackingChildren) === trackingValue
				)
				if (hasChild) return true
			}

			return false
		})
	}

	if (selectedUser.value) {
		leads = leads.filter(item => Number(item?.idUserAssigned) === Number(selectedUser.value))
	}

	if (selectedOpportunityState.value) {
		leads = leads.filter(item => Number(item?.idOpportunityState) === Number(selectedOpportunityState.value))
	}

	return leads
})

const optionsUsersAgent = ref([])
const optionsTrackingStates = ref([])
const optionsStateInterest = ref([])
const optionsHeadquarter = ref([])

function mapAffiliateCategory(value) {
	if (typeof value === 'string') return value.trim() || '-'

	switch (Number(value)) {
		case 1:
			return 'A'
		case 2:
			return 'B'
		case 3:
			return 'C'
		case 4:
			return 'Particular'
		default:
			return '-'
	}
}

function mapTrackingLead(item) {
	const userAssignedRaw = item.UserAssigned ?? item.userAssigned ?? null

	return {
		id: item.Id ?? item.id,
		name: item.Name ?? item.name,
		phone: item.Phone ?? item.phone,
		affiliateCategory: mapAffiliateCategory(item.affiliateCategory),
		headquarterName: (item.Headquarter ?? item.headquarterName ?? '').trim(),
		checkInDate: item.checkInDate ?? null,
		checkOutDate: item.checkOutDate ?? null,
		roomType: item.RoomType ?? item.roomType,
		guests: item.guests,
		exception: item.Exception ?? item.exception ?? null,
		idOpportunityState: item.idOpportunityState ?? null,
		idOpportunityTracking: item.idOpportunityTracking == null ? null : Number(item.idOpportunityTracking),
		idUserAssigned: item.idUserAssigned ?? null,
		nameResponsible: item.NameResponsible ?? item.nameResponsible ?? null,
		userAssigned: userAssignedRaw
			? {
				name: userAssignedRaw.Name ?? userAssignedRaw.name,
				specialAgent: Number(userAssignedRaw.specialAgent) === 1,
				paymentAgent: Number(userAssignedRaw.paymentAgent) === 1,
			}
			: null,
		specialAgent: Number(item.specialAgent) === 1,
		paymentAgent: Number(item.paymentAgent) === 1,
		lastConnection: item.lastConnection ?? null,
		lastOpportunityTracking: item.lastOpportunityTracking ?? item.LastOpportunityTracking ?? item.lastTrackingDate ?? item.LastTrackingDate ?? null,
		countComments: item.countComments ?? 0,
	}
}

function normalizeTrackingStates(payload) {
	const candidates = [
		payload?.data,
		payload?.items,
		payload?.trackingOpportunities,
		payload,
	]

	for (const candidate of candidates) {
		if (Array.isArray(candidate)) {
			return candidate.map(item => ({
				idTracking: Number(item.idTracking ?? item.id ?? item.Id),
				name: item.name ?? item.Name,
				color: item.color ?? item.Color ?? '#E5E7EB',
				children: (Array.isArray(item.children) ? item.children : []).map(child => ({
					idTrackingChildren: Number(child.idTrackingChildren ?? child.idTracking ?? child.id ?? child.Id),
					name: child.name ?? child.Name,
					color: child.color ?? child.Color ?? '#E5E7EB',
				}))
			}))
		}
	}

	return []
}

async function loadTrackingLeads() {
	const requestId = ++lastRequestId.value
	loading.value = true
	try {
		const params = {}
		if (appliedAdvancedFilters.value.idHeadquarter) params.idHeadquarter = Number(appliedAdvancedFilters.value.idHeadquarter)
		if (selectedUser.value) params.idUserAssigned = Number(selectedUser.value)
		if (selectedOpportunityState.value) params.idOpportunityState = Number(selectedOpportunityState.value)
		if (filters.value.idOpportunityTracking) params.idOpportunityTracking = Number(filters.value.idOpportunityTracking)
		const { data, error } = await request(() => getTrackingLeads(params), { success: false, error: true })
		if (error) return
		console.log('trackingLeads response:', data)
		const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
		if (requestId !== lastRequestId.value) return
		trackingLeads.value = list.map(mapTrackingLead)
		console.log('trackingLeads mapped:', trackingLeads.value)
		console.log('lead tracking ids:', trackingLeads.value.map(lead => lead.idOpportunityTracking))
		console.log('lead states ids:', trackingLeads.value.map(lead => lead.idOpportunityState))
	} finally {
		if (requestId === lastRequestId.value) loading.value = false
	}
}

async function loadOpportunityStates() {
	try {
		const { data, error } = await request(() => getOpportunityStates(), { success: false, error: true })
		if (error) {
			opportunityStates.value = []
			optionsStateInterest.value = []
			return
		}

		const states = Array.isArray(data?.data) ? data.data : []
		opportunityStates.value = states.map(item => ({
			id: Number(item.idState ?? item.id),
			name: (item.name ?? item.Name ?? '').trim(),
			color: item.color ?? item.Color ?? '#E5E7EB',
		}))
		optionsStateInterest.value = [...opportunityStates.value]
		console.log('opportunity states catalog:', opportunityStates.value)
	} catch (e) {
		opportunityStates.value = []
		optionsStateInterest.value = []
	}
}

async function loadTrackingStates() {
	const { data, error } = await request(() => getTrackingOpportunities(), { success: false, error: true })
	if (error) return

	optionsTrackingStates.value = normalizeTrackingStates(data)
	console.log('tracking states:', optionsTrackingStates.value)
}

async function loadTrackingParents() {
	try {
		const { data, error } = await request(() => getTrackingParents(), { success: false, error: true })
		if (error) {
			trackingParents.value = []
			return
		}

		const list = Array.isArray(data?.data) ? data.data : []
		trackingParents.value = list.map(item => ({
			id: Number(item?.idTracking),
			name: (item?.name ?? '').trim(),
			color: item?.color ?? '#E5E7EB'
		}))
	} catch (e) {
		trackingParents.value = []
	}
}

async function loadHeadquarters() {
	try {
		const { data, error } = await request(() => getHeadquarters(), { success: false, error: true })
		if (error) {
			headquarters.value = []
			return
		}

		const list = Array.isArray(data?.data) ? data.data : []
		headquarters.value = list.map(item => ({
			label: (item?.name ?? '').trim(),
			value: Number(item?.idHeadquarter)
		}))
	} catch (e) {
		headquarters.value = []
	}
}

async function loadUsers() {
	try {
		const { data, error } = await request(() => getUsers(), { success: false, error: true })
		if (error) {
			users.value = []
			optionsUsersAgent.value = []
			return
		}

		const list = Array.isArray(data?.data) ? data.data : []
		users.value = list.map(item => ({
			label: (item?.name ?? '').trim(),
			value: Number(item?.idUser)
		}))
		optionsUsersAgent.value = list.map(item => ({
			idUser: Number(item?.idUser),
			name: (item?.name ?? '').trim()
		}))
	} catch (e) {
		users.value = []
		optionsUsersAgent.value = []
	}
}

function openHistory(row) {
	if (!row) return
	refModalHistory.value.open(row.id)
}

function handleIncreaseComment(value) {
	const opportunityFinded = trackingLeads.value.find(c => c.id === value)
	if (opportunityFinded) opportunityFinded.countComments++
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
	if (!filteredTrackingLeads.value.length || loading.value) return
	const worksheet = XLSX.utils.json_to_sheet(filteredTrackingLeads.value)
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, 'tracking-leads')
	XLSX.writeFile(workbook, 'tracking-leads.xlsx')
}

function onFilterData() {
	appliedAdvancedFilters.value = {
		idHeadquarter: filters.value.idHeadquarter ? Number(filters.value.idHeadquarter) : null,
		startEnd: filters.value.startEnd ?? null,
	}
	loadTrackingLeads()
}
function onChangeTracking() {}
function handleActionAgent() {}

function runHotFilters() {
	if (hotFilterTimer.value) clearTimeout(hotFilterTimer.value)
	hotFilterTimer.value = setTimeout(() => {
		loadTrackingLeads()
	}, 250)
}

watch(selectedHeadquarter, (value) => {
	filters.value.idHeadquarter = value
})
watch(selectedUser, (value) => {
	filters.value.idUserAssigned = value
	runHotFilters()
})
watch(selectedOpportunityState, (value) => {
	filters.value.idOpportunityState = value
	runHotFilters()
})
watch(selectedTrackingParent, (value) => {
	filters.value.idOpportunityTracking = value
	runHotFilters()
})

onMounted(async () => {
	await Promise.all([
		loadTrackingLeads(),
		loadOpportunityStates(),
		loadTrackingStates(),
		loadHeadquarters(),
		loadUsers(),
		loadTrackingParents()
	])
})
</script>

