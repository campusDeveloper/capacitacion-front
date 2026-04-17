<template>
	<section class="vstack overflow-hidden h-full">
		<Navbar contentBtn="Crear cliente" name="Clientes" />
		<div class="vstack overflow-hidden h-full px-6 pt-6 pb-2">
			<div class="flex text-[rgb(var(--xx-color-text-secondary))] f-tm-14 items-end gap-x-4 mb-5">
				<p class="f-tm-16 text-[rgb(var(--xx-color-text-primary))] me-auto">Lista de clientes</p>
				<div class="w-[241px]">
					<el-input clearable v-model="filters.name" placeholder="Buscar" />
				</div>
				<div class="w-[241px]">
					<p class="pb-1">Desde-hasta</p>
					<el-date-picker v-model="filters.startEnd" type="daterange" start-placeholder="Desde"
						end-placeholder="Hasta" class="!w-full" />
				</div>
				<div class="w-[210px]">
					<p class="pb-1">Sedes</p>
					<el-select clearable v-model="filters.idHeadquarter" placeholder="Seleccionar">
						<el-option v-for="item in optionsHQSelect" :key="item.idHeadquarter" :label="item.name"
							:value="item.idHeadquarter">
						</el-option>
					</el-select>
				</div>
				<Button :disabled="loading" type-style="tertiary" class="w-[86px]"
					@click="handleFilter">Filtrar</Button>
				<el-tooltip :disabled="loading" content="Exportar" placement="top">
					<Button type-style="secondary" class="!p-0" @click="handleExportFile">
						<i class="icon-document-download !text-xl" />
					</Button>
				</el-tooltip>
			</div>
			<el-table :data="customers">
				<el-table-column label="Tipo de cliente" prop="idCustomerType" width="185" fixed>
					<template #default="scope">
						<SelectDropdown :disabled="loading" v-model="scope.row.idCustomerType"
							:options="optionsTypesSelect"  />
					</template>
				</el-table-column>
				<el-table-column label="Nombre" prop="name" width="180" sortable fixed />
				<el-table-column label="Teléfono" prop="phone" width="155" fixed />
				<el-table-column label="Identificación" prop="identification" width="125" />
				<el-table-column label="Categoría" width="95" align="center">
					<template #default="scope">
						<p>A</p>
					</template>
				</el-table-column>
				<el-table-column label="Reserva" prop="number" width="140">
					<template #default="scope">
						<div class="d-middle-bt">
							<p>{{ scope.row.reservation?.number ?? "Sin reserva" }}</p>
							<button v-if="scope.row.reservation?.number"
								class="icon-document-text text-mid-gray-300 text-xl cursor-pointer"
								@click="openReservationHistory(scope.row)" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Checkin" width="120" align="right">
					<template #default="scope">
						<div class="d-middle-end gap-x-1">
							<p v-if="!scope.row.reservation?.countGuests && scope.row.reservation?.checkInDate">
								{{ checkInHourDiff(scope.row.reservation) }}
								H
							</p>
							<el-tooltip :content="checkInStyles(scope.row.reservation).tooltip" placement="top">
								<i :class="['icon-timer text-lg', checkInStyles(scope.row.reservation).color]"/>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Fecha reserva" width="210">
					<template #default="scope">
						<div class="d-middle-bt">
							<p>{{ DateFormat(scope.row.reservation?.checkInDate, 'DD MMM YYYY') }} -
								{{ DateFormat(scope.row.reservation?.checkOutDate, 'DD MMM YYYY') }}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Sede" width="185">
					<template #default="scope">
						<div class="d-middle-bt">
							<p>{{ scope.row.reservation?.headquarter ?? "-" }}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Tipo alojamiento" width="125">
					<template #default="scope">
						<div class="d-middle-bt">
							<p>{{ scope.row.reservation?.roomType ?? "-" }}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Numero Huespedes" width="95" align="center">
					<template #default="scope">
						<div class="d-middle">
							<p>{{ scope.row.reservation?.countGuests ?? "-" }}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Valor Pagado" prop="value" width="95" align="right">
					<template #default="scope">
						<p>{{ currencyFormat(scope.row.reservation?.valuePaid) ?? "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Valor Total" prop="value" width="95" align="right">
					<template #default="scope">
						<p>{{ currencyFormat(scope.row.reservation?.valueTotal) ?? "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Historial Chat" width="95" align="center">
					<template #default="scope">
						<i class="icon-document-text text-mid-gray-300 text-xl cursor-pointer"
							@click="openHistory(scope.row)" />
					</template>
				</el-table-column>
				<el-table-column label="Comentarios" width="95" align="center">
					<template #default="scope">
						<div class="d-middle-center h-[40px]">
							<el-badge :value="scope.row.countComments" class="custom-badge">
								<i class="icon-message text-xl text-blue-s-500 cursor-pointer"
									@click="openModalComments(scope.row)" />
							</el-badge>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Modal ref="refModalInactiveClient" action="Activar" cancel="Cancelar" title="Activar cliente" width="360"
			:onAction="handleInactiveClient">
			<p>¿Deseas activar este cliente? <br /> Al hacerlo, se habilitarán sus funciones en todo el sistema</p>
		</Modal>
		<Modal ref="refModalActiveClient" type="danger" action="Inactivar" cancel="Cancelar" title="Inactivar cliente"
			width="360" woIcon :onAction="handleActiveClient">
			<p>¿Deseas inactivar este cliente? <br /> Al hacerlo, se inhabilitarán sus funciones en todo el sistema</p>
		</Modal>
		<modalHistory ref="refModalHistory" />
		<modalReservationHistory ref="refModalReservationHistory" />
		<modalComments ref="refModalComments" @increase-comment="handleIncreaseComment" />
	</section>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { DateFormat } from '@/util/dateFormat.js'
import { currencyFormat } from '@/util/currencyFormat.js'
import { request } from "@request";
import { dateDifferenceInHours } from '../../../util/hourDifference';
import * as XLSX from 'xlsx';
import SelectDropdown from '@comp/SelectDropdown.vue'
import modalHistory from '../partials/modalHistory.vue'
import modalReservationHistory from '../partials/modalReservationHistory.vue'
import modalComments from '../partials/modalComments.vue'

const refModalInactiveClient = ref()
const refModalActiveClient = ref()
const refModalHistory = ref()
const refModalReservationHistory = ref()
const refModalComments = ref()

const loading = ref(false)

const checkInState = [
	{ tooltip: 'no disponible', color: 'text-mid-gray-300' },
	{ tooltip: 'disponible', color: 'text-brand-300' },
	{ tooltip: 'realizado', color: 'text-green-s-600' },
	{ tooltip: 'vencido', color: 'text-red-s-600' }
]

const filters = ref({
	startEnd: null,
	idHeadquarter: null,
	name: null
})

const customers = ref([])

const optionsHQSelect = ref([])

const optionsTypesSelect = ref([])

/* Functions */

async function handleFilter() {
	if (loading.value) return

	const { value: filtros } = filters

	const getFilters = {
		name: filtros.name,
		idHeadquarter: filtros.idHeadquarter
	}

	if (filtros.startEnd) {
		getFilters.reservationDateStart = filtros.startEnd[0];
		getFilters.reservationDateEnd = filtros.startEnd[1];
	}

}

function handleExportFile() {
	if (!customers.value || loading.value) return
}

async function onChangePriority(value, row) {
	if (!value || !row || loading.value) return

}

function formatAffiliateCategory() {
	switch (1) {
		case 1:
			return "A";
		case 2:
			return "B";
		case 3:
			return "C";
		case 4:
			return "Particular";
		default:
			return "-";
	}
}

function checkInHourDiff() {
	
}

function checkInStyles(reservation) {
	let state = 0

	if (!reservation.id) return {
		tooltip: `Pre-checkin ${ checkInState[state].tooltip }`,
		color: checkInState[state].color
	}

	if (reservation.countGuests > 0) {
		state = 2
	} else if (dateDifferenceInHours(new Date(), reservation.checkInDate + " 15:00") < 48) {
		state = 3
	} else {
		state = 1
	}

	return {
		tooltip: `Pre-checkin ${ checkInState[state].tooltip }`,
		color: checkInState[state].color
	}
}

function handleIncreaseComment() {
	
}

function openReservationHistory() {
	refModalReservationHistory.value.open()
}

function openHistory() {
	refModalHistory.value.open()
}

function openModalComments() {
	refModalComments.value.open()
}

function toggleState(row) {  // ← SOLO 'row'
	refModalActiveClient.value.open()
	
}

function handleInactiveClient() {
}

function handleActiveClient() {
}

</script>