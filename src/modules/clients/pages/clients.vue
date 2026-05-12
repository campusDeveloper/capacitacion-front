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
					<el-date-picker v-model="filters.date" type="daterange" start-placeholder="Desde"
						end-placeholder="Hasta" value-format="YYYY-MM-DD" class="!w-full" />
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
			<el-table :data="customers" :key="customers.length" v-loading="loading">
				<el-table-column label="Tipo de cliente" prop="idCustomerType" width="185" fixed>
					<template #default="scope">
						<el-select
							:disabled="loading"
							:model-value="customerTypeSelectValue(scope.row)"
							class="custom-select"
							size="small"
							placement="right"
							popper-class="!max-w-[148px]"
							:style="customerTypeSelectStyle(scope.row)"
							@update:model-value="updateCustomerType(scope.row, $event)"
						>
							<el-option
								v-for="item in optionsTypesSelect"
								:key="item.id"
								:label="item.name"
								:value="item.id"
								class="d-middle !mb-1 !h-[26px]"
								:style="`background-color:${item.color} !important; color: rgb(var(--xx-color-white-100))`"
							>
								<p class="line-clamp-1">{{ item.name }}</p>
							</el-option>
						</el-select>
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
							<p>{{ scope.row.reservation?.checkInDate ? DateFormat(scope.row.reservation.checkInDate, 'DD MMM YYYY') : '-' }} -
								{{ scope.row.reservation?.checkOutDate ? DateFormat(scope.row.reservation.checkOutDate, 'DD MMM YYYY') : '-' }}</p>
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
						<p>{{ scope.row.reservation?.valuePaid ? currencyFormat(scope.row.reservation.valuePaid) : "-" }}</p>
					</template>
				</el-table-column>
				<el-table-column label="Valor Total" prop="value" width="95" align="right">
					<template #default="scope">
						<p>{{ scope.row.reservation?.valueTotal ? currencyFormat(scope.row.reservation.valueTotal) : "-" }}</p>
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
import { onMounted, ref } from 'vue'
import { DateFormat } from '@/util/dateFormat.js'
import { currencyFormat } from '@/util/currencyFormat.js'
import { request } from "@request";
import { dateDifferenceInHours } from '../../../util/hourDifference';
import * as XLSX from 'xlsx';
import modalHistory from '../partials/modalHistory.vue'
import modalReservationHistory from '../partials/modalReservationHistory.vue'
import modalComments from '../partials/modalComments.vue'
import { getClients, getHeadquarters, getCustomerTypes, changeCustomerType } from '../services/clientService'

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
	date: '',
	idHeadquarter: null,
	name: ''
})

const customers = ref([])

const optionsHQSelect = ref([])

const optionsTypesSelect = ref([])

const CUSTOMER_TYPE_EMPTY_VALUE = 'Sin etiqueta'

const fetchClients = async () => {
  loading.value = true;

  try {
    const params = { ...filters.value };

    if (params.date && Array.isArray(params.date)) {
      params.dateFrom = params.date[0];
      params.dateTo = params.date[1];
      delete params.date;
    }

    if (params.idHeadquarter) {
      params.headquarter = params.idHeadquarter;
      delete params.idHeadquarter;
    }

    const { data, error } = await request(() => getClients(params), false);

    if (error) {
      customers.value = [];
      return;
    }

    const array = Array.isArray(data) ? data : (data?.data || []);
    customers.value = array;

    console.log('CLIENTS 👉', array);
    console.log('IS ARRAY:', Array.isArray(array));
  } finally {
    loading.value = false;
  }
};

const fetchHeadquarters = async () => {
  const { data, error } = await request(() => getHeadquarters(), false);

  if (error) {
    console.error('Error sedes:', error);
    optionsHQSelect.value = [];
    return;
  }

  const array = Array.isArray(data) ? data : (data?.data || []);
  optionsHQSelect.value = array;
};

const fetchCustomerTypes = async () => {
  const { data, error } = await request(() => getCustomerTypes(), false);

  if (error) {
    console.error('Error tipos:', error);
    optionsTypesSelect.value = [];
    return;
  }

  const array = Array.isArray(data) ? data : (data?.data || []);
  optionsTypesSelect.value = array.map(item => ({ ...item, id: item.idType }));
};

/* Functions */

function customerTypeSelectValue(row) {
	if (row?.idCustomerType == null) return CUSTOMER_TYPE_EMPTY_VALUE

	return hasActiveCustomerType(row) ? row.idCustomerType : CUSTOMER_TYPE_EMPTY_VALUE
}

function customerTypeSelectStyle(row) {
	const selectedOption = getActiveCustomerType(row)
	const colorBg = selectedOption?.color ?? 'rgb(var(--xx-color-gray-300))'
	const colorContentLight = 'rgb(var(--xx-color-white-400))'

	return `--color-bg: ${colorBg}; --color-content-light: ${colorContentLight};`
}

function getActiveCustomerType(row) {
	return optionsTypesSelect.value.find(type => type.id == row?.idCustomerType)
}

function hasActiveCustomerType(row) {
	return !!getActiveCustomerType(row)
}

function getCustomerId(row) {
	return row?.idCustomer ?? row?.id
}

async function updateCustomerType(row, value) {
	if (!row || loading.value || value === CUSTOMER_TYPE_EMPTY_VALUE || value == null) return

	const idCustomer = getCustomerId(row)
	if (!idCustomer || row.idCustomerType === value) return

	loading.value = true

	try {
		const { error } = await request(() => changeCustomerType(idCustomer, value), false)
		if (error) return

		row.idCustomerType = value
	} finally {
		loading.value = false
	}
}

const handleFilter = () => {
  fetchClients();
};

function handleExportFile() {
	if (!customers.value || loading.value) return
}

async function onChangePriority(value, row) {
	if (!value || !row || loading.value) return

}

function formatAffiliateCategory(category) {
 	switch (category) {
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

function checkInHourDiff(reservation) {
  if (!reservation || !reservation.checkInDate) return '';
  return dateDifferenceInHours(new Date(), reservation.checkInDate + " 15:00");
}

function checkInStyles(reservation) {
	let state = 0

	if (!reservation) return {
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

function openReservationHistory(row) {
	if (!row || loading.value) return

	const idCustomer = getCustomerId(row)
	if (!idCustomer) return

	refModalReservationHistory.value.open(idCustomer)
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

onMounted(async () => {
  await Promise.all([fetchHeadquarters(), fetchCustomerTypes(), fetchClients()]);
});

</script>
