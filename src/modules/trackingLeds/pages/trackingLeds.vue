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
			<el-table :data="filteredTrackingLeads" v-loading="loading" empty-text="No hay leads disponibles">
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
						<SelectDropdown
							v-model="scope.row.idOpportunityState"
							:disabled="isUpdatingOpportunityState(scope.row.id)"
							:options="stateOptionsForTable"
							@change="onChangeOpportunityState(scope.row, $event)"
						/>
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
						<SelectStatusFollowUp v-if="optionsTrackingStates.length > 0" :disabled="loading || isUpdatingTracking(scope.row.id)" isOutline v-model="scope.row.idOpportunityTracking" :options="optionsTrackingStates"
							@change="onChangeTracking(scope.row, $event)" />
					</template>
				</el-table-column>
				<el-table-column label="Últ. seguimiento" width="140">
					<template #default="scope">
						<p>{{ scope.row.lastOpportunityTracking ? DateFormat(scope.row.lastOpportunityTracking, 'DD MMM YYYY') : '-' }}</p>
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
		<modalHistory
			ref="refModalHistory"
			:loading-messages-history="loadingMessagesHistory"
			:messages-history="messagesHistory"
			:messages-history-error="messagesHistoryError"
			:last-connection="messagesHistoryLastConnection"
			@close="resetMessagesHistory"
		/>
		<modalComments ref="refModalComments" @increase-comment="handleIncreaseComment"/>
	</section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { DateFormat } from '@/util/dateFormat.js'
import { request } from '@request'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx-style'
import SelectStatusFollowUp from '@comp/SelectStatusFollowUp.vue'
import SelectDropdown from '@comp/SelectDropdown.vue'
import modalSpecializedAgent from '../partials/modalSpecializedAgent.vue'
import modalHistory from '../partials/modalHistory.vue'
import modalComments from '../partials/modalComments.vue'
import { getTrackingLeads, getHeadquarters, getUsers, getOpportunityStates, getTrackingParents, changeOpportunityState, changeAssignedUser, getCustomerMessagesHistory, getOpportunityTracking, changeOpportunityTracking } from '../services/trackingLeadsService'

const refModalHandleAgent = ref()
const refModalHistory = ref()
const refModalComments = ref()

const loading = ref(false)
const search = ref('')
const showFilter = ref(false)
const hotFilterTimer = ref(null)
const lastRequestId = ref(0)
const updatingOpportunityStateIds = ref([])
const updatingAssignedUserIds = ref([])
const updatingTrackingIds = ref([])
const loadingMessagesHistory = ref(false)
const messagesHistory = ref([])
const messagesHistoryError = ref('')
const messagesHistoryRequestId = ref(0)
const messagesHistoryLastConnection = ref(null)
const messagesHistoryCustomerId = ref(null)

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
	idOpportunityState: null,
	idOpportunityTracking: null,
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

	return [
		{ id: null, name: 'Sin asignar', color: '#909399' },
		...catalog,
		...fallbackOptions
	]
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

	if (appliedAdvancedFilters.value.idOpportunityTracking) {
		leads = leads.filter(item => {
			const trackingValue = Number(item?.idOpportunityTracking)
			const selectedValue = Number(appliedAdvancedFilters.value.idOpportunityTracking)
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

	if (appliedAdvancedFilters.value.idOpportunityState) {
		leads = leads.filter(item => Number(item?.idOpportunityState) === Number(appliedAdvancedFilters.value.idOpportunityState))
	}

	if (filters.value.startEnd?.length === 2) {
		const [start, end] = filters.value.startEnd
		const startTime = normalizeDateForCompare(start, false)
		const endTime = normalizeDateForCompare(end, true)

		if (startTime && endTime) {
			leads = leads.filter(item => {
				const checkInTime = normalizeDateForCompare(item?.checkInDate, false)
				if (!checkInTime) return false
				return checkInTime >= startTime && checkInTime <= endTime
			})
		}
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
		idCustomer: item.idCustomer ?? item.customerId ?? item.CustomerId ?? item.customer?.id ?? item.Customer?.id ?? null,
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
		lastOpportunityTracking: item.lastOpportunityTracking ?? item.LastOpportunityTracking ?? item.lastTrackingDate ?? item.LastTrackingDate ?? item.UpdatedAt ?? item.updatedAt ?? null,
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

function mapMessageHistory(item) {
	const content = item.Content ?? item.content

	return {
		id: item.Id ?? item.id,
		type: Number(item.Type ?? item.type ?? 1),
		content: typeof content === 'string' && content.trim() ? content : 'Sin contenido',
		lastConnection: item.lastConnection ?? item.LastConnection ?? null,
	}
}

function normalizeDateForCompare(value, endOfDay = false) {
	if (!value) return null
	const date = value instanceof Date ? new Date(value) : new Date(value)
	if (Number.isNaN(date.getTime())) return null
	date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0)
	return date.getTime()
}

async function loadTrackingLeads() {
	const requestId = ++lastRequestId.value
	loading.value = true
	try {
		const params = {}
		if (appliedAdvancedFilters.value.idHeadquarter) params.idHeadquarter = Number(appliedAdvancedFilters.value.idHeadquarter)
		if (selectedUser.value) params.idUserAssigned = Number(selectedUser.value)
		if (appliedAdvancedFilters.value.idOpportunityState) params.idOpportunityState = Number(appliedAdvancedFilters.value.idOpportunityState)
		if (appliedAdvancedFilters.value.idOpportunityTracking) params.idOpportunityTracking = Number(appliedAdvancedFilters.value.idOpportunityTracking)
		if (filters.value.startEnd?.length === 2) {
			params.reservationDateStart = filters.value.startEnd[0]
			params.reservationDateEnd = filters.value.startEnd[1]
		}
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
  try {
    const { data, error } = await request(() => getOpportunityTracking(), { success: false, error: true })
    if (error) {
      console.error('Error loading tracking states:', error)
      optionsTrackingStates.value = []
      return
    }

    optionsTrackingStates.value = normalizeTrackingStates(data)
    console.log('tracking states loaded:', optionsTrackingStates.value)
  } catch (e) {
    console.error('Exception loading tracking states:', e)
    optionsTrackingStates.value = []
  }
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
			name: (item?.name ?? '').trim(),
			specialAgent: Number(item?.specialAgent) === 1,
			paymentAgent: Number(item?.paymentAgent) === 1,
		}))
	} catch (e) {
		users.value = []
		optionsUsersAgent.value = []
	}
}

async function openHistory(row) {
	if (!row) return
	console.log('selected lead', row)
	const idCustomer = row.idCustomer
	if (!idCustomer) {
		ElMessage.warning('Este lead no tiene cliente asociado')
		return
	}
	if (loadingMessagesHistory.value && messagesHistoryCustomerId.value === idCustomer) return
	refModalHistory.value.open()
	loadMessagesHistory(idCustomer, row.lastConnection)
}

function resetMessagesHistory() {
	messagesHistoryRequestId.value++
	loadingMessagesHistory.value = false
	messagesHistory.value = []
	messagesHistoryError.value = ''
	messagesHistoryLastConnection.value = null
	messagesHistoryCustomerId.value = null
}

async function loadMessagesHistory(idCustomer, fallbackLastConnection = null) {
	const requestId = ++messagesHistoryRequestId.value
	messagesHistoryCustomerId.value = idCustomer
	messagesHistory.value = []
	messagesHistoryError.value = ''
	messagesHistoryLastConnection.value = fallbackLastConnection
	loadingMessagesHistory.value = true
	console.log('history endpoint', `/customer/${idCustomer}/messages-history`)

	try {
		if (idCustomer === null || typeof idCustomer === 'undefined' || idCustomer === '' || Number.isNaN(Number(idCustomer))) {
			messagesHistoryError.value = 'Error cargando historial'
			return
		}

		const { data, error } = await request(
			() => getCustomerMessagesHistory(idCustomer),
			{ success: false, error: true }
		)
		console.log('messagesHistory API response', data)

		if (requestId !== messagesHistoryRequestId.value) return

		if (error) {
			messagesHistoryError.value = 'Error cargando historial'
			return
		}

		const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
		const normalizedMessages = list.map(mapMessageHistory)
		console.log('messagesHistory mapped', normalizedMessages)
		messagesHistory.value = [...normalizedMessages]
		messagesHistoryLastConnection.value = messagesHistory.value.find(item => item.lastConnection)?.lastConnection ?? fallbackLastConnection
	} catch (e) {
		if (requestId === messagesHistoryRequestId.value) messagesHistoryError.value = 'Error cargando historial'
	} finally {
		if (requestId === messagesHistoryRequestId.value) loadingMessagesHistory.value = false
	}
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
	if (!row || loading.value || isUpdatingAssignedUser(row.id)) return
	const currentAgentName = row.nameResponsible ?? row.userAssigned?.name ?? null
	refModalHandleAgent.value.open(optionsUsersAgent.value, row.id, row.idUserAssigned, true, currentAgentName)
}

function openEditSpecializedAgent(row) {
	if (!row || loading.value || isUpdatingAssignedUser(row.id)) return
	const currentAgentName = row.nameResponsible ?? row.userAssigned?.name ?? null
	refModalHandleAgent.value.open(optionsUsersAgent.value, row.id, row.idUserAssigned, false, currentAgentName)
}

function getStateName(idOpportunityState) {
	if (idOpportunityState == null) return '-'
	const found = (opportunityStates.value ?? []).find(
		item => Number(item.id) === Number(idOpportunityState)
	)
	return found?.name ?? '-'
}

function handleExportFile() {
	if (!filteredTrackingLeads.value.length || loading.value) return

	const exportData = filteredTrackingLeads.value.map(lead => ({
		Nombre: lead.name ?? '-',
		Telefono: lead.phone ?? '-',
		Categoria: lead.affiliateCategory ?? '-',
		Estado: getStateName(lead.idOpportunityState),
		'Fecha Entrada': lead.checkInDate
			? DateFormat(lead.checkInDate, 'DD MMM YYYY')
			: '-',
		'Fecha Salida': lead.checkOutDate
			? DateFormat(lead.checkOutDate, 'DD MMM YYYY')
			: '-',
		Sede: lead.headquarterName ?? '-',
		'Tipo Alojamiento': lead.roomType ?? '-',
		'Cant. Huespedes': lead.guests ?? '-',
		Responsable:
			lead.nameResponsible?.trim()
			|| lead.userAssigned?.name?.trim()
			|| 'Sin responsable',
	}))

	const worksheet = XLSX.utils.json_to_sheet(exportData)
	const headerStyle = { alignment: { horizontal: 'center' } }
	const bodyStyle = { alignment: { horizontal: 'left' } }

	const totalRows = exportData.length

	// Encabezados: fila 1, columnas 0-9  → A1:J1
	const headerRange = XLSX.utils.decode_range('A1:J1')
	for (let c = headerRange.s.c; c <= headerRange.e.c; c++) {
		const address = XLSX.utils.encode_cell({ r: headerRange.s.r, c })
		if (worksheet[address]) worksheet[address].s = headerStyle
	}

	// Cuerpo: filas 2 en adelante, columnas 0-9  → A2:J{totalRows+1}
	if (totalRows > 0) {
		for (let r = 1; r <= totalRows; r++) {
			for (let c = 0; c <= 9; c++) {
				const address = XLSX.utils.encode_cell({ r, c })
				if (worksheet[address]) worksheet[address].s = bodyStyle
			}
		}
	}

	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')
	XLSX.writeFile(workbook, 'leads.xlsx')
}

function isUpdatingOpportunityState(idOpportunity) {
	return updatingOpportunityStateIds.value.includes(idOpportunity)
}

function setOpportunityStateUpdating(idOpportunity, value) {
	if (value) {
		if (!isUpdatingOpportunityState(idOpportunity)) {
			updatingOpportunityStateIds.value = [...updatingOpportunityStateIds.value, idOpportunity]
		}
		return
	}

	updatingOpportunityStateIds.value = updatingOpportunityStateIds.value.filter(id => id !== idOpportunity)
}

function normalizeStateValue(value) {
	if (value === null || typeof value === 'undefined' || value === '') return null
	return Number(value)
}

function updateOpportunityStateLocally(idOpportunity, idState) {
	const lead = trackingLeads.value.find(item => item.id === idOpportunity)
	if (lead) lead.idOpportunityState = idState
}

async function onChangeOpportunityState(row, value) {
	if (!row?.id || isUpdatingOpportunityState(row.id)) return

	const previousState = normalizeStateValue(row.idOpportunityState)
	const nextState = normalizeStateValue(value)
	if (previousState === nextState) return

	setOpportunityStateUpdating(row.id, true)

	try {
		const payload = { idState: nextState }
		const { data, error } = await request(
			() => changeOpportunityState(row.id, payload),
			{ success: true, error: true }
		)

		const isUpdated = data?.data === true || data === true
		if (error || !isUpdated) {
			updateOpportunityStateLocally(row.id, previousState)
			if (!error) ElMessage.error(data?.message ?? 'No se pudo actualizar el estado de interés.')
			return
		}

		updateOpportunityStateLocally(row.id, nextState)
	} catch (e) {
		updateOpportunityStateLocally(row.id, previousState)
		ElMessage.error('No se pudo actualizar el estado de interés.')
	} finally {
		setOpportunityStateUpdating(row.id, false)
	}
}

function isUpdatingAssignedUser(idOpportunity) {
	return updatingAssignedUserIds.value.includes(idOpportunity)
}

function setAssignedUserUpdating(idOpportunity, value) {
	if (value) {
		if (!isUpdatingAssignedUser(idOpportunity)) {
			updatingAssignedUserIds.value = [...updatingAssignedUserIds.value, idOpportunity]
		}
		return
	}

	updatingAssignedUserIds.value = updatingAssignedUserIds.value.filter(id => id !== idOpportunity)
}

function normalizeUserValue(value) {
	if (value === null || typeof value === 'undefined' || value === '') return null
	return Number(value)
}

function mapAssignedUserFromResponse(payload, idUser) {
	const userAssignedRaw = payload?.UserAssigned ?? payload?.userAssigned ?? null
	const nameResponsible = payload?.NameResponsible ?? payload?.nameResponsible ?? userAssignedRaw?.name ?? userAssignedRaw?.Name ?? null

	if (userAssignedRaw || nameResponsible) {
		return {
			idUserAssigned: payload?.idUserAssigned ?? idUser,
			nameResponsible,
			userAssigned: userAssignedRaw
				? {
					name: userAssignedRaw.Name ?? userAssignedRaw.name ?? nameResponsible,
					specialAgent: Number(userAssignedRaw.specialAgent) === 1,
					paymentAgent: Number(userAssignedRaw.paymentAgent) === 1,
				}
				: nameResponsible
					? {
						name: nameResponsible,
						specialAgent: Number(payload?.specialAgent) === 1,
						paymentAgent: Number(payload?.paymentAgent) === 1,
					}
					: null,
			specialAgent: Number(payload?.specialAgent ?? userAssignedRaw?.specialAgent) === 1,
			paymentAgent: Number(payload?.paymentAgent ?? userAssignedRaw?.paymentAgent) === 1,
		}
	}

	if (!idUser) {
		return {
			idUserAssigned: null,
			nameResponsible: null,
			userAssigned: null,
			specialAgent: false,
			paymentAgent: false,
		}
	}

	const selectedUserInfo = optionsUsersAgent.value.find(item => Number(item.idUser) === Number(idUser))

	return {
		idUserAssigned: idUser,
		nameResponsible: selectedUserInfo?.name ?? null,
		userAssigned: selectedUserInfo
			? {
				name: selectedUserInfo.name,
				specialAgent: Number(selectedUserInfo.specialAgent) === 1,
				paymentAgent: Number(selectedUserInfo.paymentAgent) === 1,
			}
			: null,
		specialAgent: Number(selectedUserInfo?.specialAgent) === 1,
		paymentAgent: Number(selectedUserInfo?.paymentAgent) === 1,
	}
}

function applyAssignedUserToRow(row, assignedUser) {
	row.idUserAssigned = assignedUser.idUserAssigned
	row.nameResponsible = assignedUser.nameResponsible
	row.userAssigned = assignedUser.userAssigned
	row.specialAgent = assignedUser.specialAgent
	row.paymentAgent = assignedUser.paymentAgent
}

async function handleActionAgent({ idOpportunity, idUser }) {
	if (!idOpportunity || isUpdatingAssignedUser(idOpportunity)) return

	const row = trackingLeads.value.find(item => item.id === idOpportunity)
	if (!row) return

	const previousAssignedUser = {
		idUserAssigned: row.idUserAssigned,
		nameResponsible: row.nameResponsible,
		userAssigned: row.userAssigned ? { ...row.userAssigned } : null,
		specialAgent: row.specialAgent,
		paymentAgent: row.paymentAgent,
	}
	const nextIdUser = normalizeUserValue(idUser)

	if (normalizeUserValue(row.idUserAssigned) === nextIdUser) {
		refModalHandleAgent.value.close()
		return
	}

	setAssignedUserUpdating(idOpportunity, true)

	try {
		const { data, error } = await request(
			() => changeAssignedUser(idOpportunity, { idUser: nextIdUser }),
			{ success: true, error: true }
		)

		const responseData = typeof data?.data !== 'undefined' ? data.data : data
		const isUpdated = responseData === true || (responseData && typeof responseData === 'object') || nextIdUser === null
		if (error || !isUpdated) {
			applyAssignedUserToRow(row, previousAssignedUser)
			if (!error) ElMessage.error(data?.message ?? 'No se pudo actualizar el responsable.')
			return
		}

		const assignedUser = mapAssignedUserFromResponse(responseData === true ? null : responseData, nextIdUser)
		applyAssignedUserToRow(row, assignedUser)
		refModalHandleAgent.value.close()
	} catch (e) {
		applyAssignedUserToRow(row, previousAssignedUser)
		ElMessage.error('No se pudo actualizar el responsable.')
	} finally {
		setAssignedUserUpdating(idOpportunity, false)
	}
}

function clearHotFilterTimer() {
	if (!hotFilterTimer.value) return
	clearTimeout(hotFilterTimer.value)
	hotFilterTimer.value = null
}

function onFilterData() {
	clearHotFilterTimer()
	appliedAdvancedFilters.value = {
		idHeadquarter: filters.value.idHeadquarter ? Number(filters.value.idHeadquarter) : null,
		idOpportunityState: filters.value.idOpportunityState ? Number(filters.value.idOpportunityState) : null,
		idOpportunityTracking: filters.value.idOpportunityTracking ? Number(filters.value.idOpportunityTracking) : null,
	}
	loadTrackingLeads()
}

function isUpdatingTracking(idOpportunity) {
  return updatingTrackingIds.value.includes(idOpportunity)
}

function setTrackingUpdating(idOpportunity, value) {
  if (value) {
    if (!isUpdatingTracking(idOpportunity)) {
      updatingTrackingIds.value = [...updatingTrackingIds.value, idOpportunity]
    }
    return
  }
  updatingTrackingIds.value = updatingTrackingIds.value.filter(id => id !== idOpportunity)
}

function updateTrackingLocally(idOpportunity, idTrackingChildren) {
  const lead = trackingLeads.value.find(item => item.id === idOpportunity)
  if (lead) lead.idOpportunityTracking = idTrackingChildren
}

async function onChangeTracking(row, value) {
  if (!row?.id || isUpdatingTracking(row.id)) return

  const previousTracking = normalizeStateValue(row.idOpportunityTracking)
  const nextTracking = normalizeStateValue(value)
  if (previousTracking === nextTracking) return

  setTrackingUpdating(row.id, true)

  try {
    const payload = { idTrackingChildren: nextTracking }
    const { data, error } = await request(
      () => changeOpportunityTracking(row.id, payload),
      { success: true, error: true }
    )

    const isUpdated = data?.data === true || data === true
    if (error || !isUpdated) {
      updateTrackingLocally(row.id, previousTracking)
      if (!error) ElMessage.error(data?.message ?? 'No se pudo actualizar el estado de seguimiento.')
      return
    }

    updateTrackingLocally(row.id, nextTracking)
  } catch (e) {
    updateTrackingLocally(row.id, previousTracking)
    ElMessage.error('No se pudo actualizar el estado de seguimiento.')
  } finally {
    setTrackingUpdating(row.id, false)
  }
}

function runHotFilters() {
	clearHotFilterTimer()
	hotFilterTimer.value = setTimeout(() => {
		hotFilterTimer.value = null
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
})
watch(selectedTrackingParent, (value) => {
	filters.value.idOpportunityTracking = value
})
watch(() => filters.value.startEnd, () => {
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

