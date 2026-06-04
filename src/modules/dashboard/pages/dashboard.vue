<template>
	<section class="vstack h-full w-full">
		<Navbar name="Dashboard" />
		<el-scrollbar view-class="vstack gap-y-6 px-10 py-8">
			<div class="d-middle-bt">
				<p class="text-mid-gray-600 f-ts-16">Estadísticas generales</p>
				<div class="vstack w-[241px] gap-y-1">
					<p class="f-tm-13">Tiempo </p>
					<el-select v-model="idTime" placeholder="Seleccionar">
						<el-option v-for="item in optionsTime" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="grid grid-cols-4 gap-5">
				<div
					class="d-middle gap-x-4 rounded-xl bg-brand-50 px-4 py-2 text-mid-gray-600 col-span-1 row-span-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
					<p class="f-tm-14">Clientes totales</p>
					<p class="f-ts-16 ms-auto">{{ formatNumber(generalData.customers) }}</p>
				</div>
				<el-tooltip content="Leads atendidos vs concretaron reservas" placement="top">
					<div
						class="d-middle gap-x-2 rounded-xl bg-green-50 px-4 py-2 text-mid-gray-600 col-span-1 row-span-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
						<p class="f-tm-14">Tasa de conversión</p>
						<p class="f-ts-16 ms-auto">{{ generalData.conversionRate }}</p>
					</div>
				</el-tooltip>
				<div
					class="d-middle gap-x-2 rounded-xl bg-white-300 px-4 py-2 text-mid-gray-600 col-span-1 row-span-1 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
					<i class="icon-cup text-xl text-brand-500" />
					<p class="f-tm-14">Casos efectivos</p>
					<p class="f-ts-16 ms-auto">{{ formatNumber(generalData.casesEffective) }}</p>
				</div>
				<div
					class="d-middle gap-x-2 rounded-xl bg-white-300 px-4 py-2 text-mid-gray-600 col-span-1 row-span-1 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
					<i class="icon-message-notif text-xl text-brand-500" />
					<p class="f-tm-14">Casos atendidos</p>
					<p class="f-ts-16 ms-auto">{{ formatNumber(generalData.casesAttended) }}</p>
				</div>
				<div
					class="d-middle gap-x-2 rounded-xl bg-white-300 px-4 py-2 text-mid-gray-600 col-span-1 row-span-1 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
					<i class="icon-magic-star text-xl text-brand-500" />
					<p class="f-tm-14">Reservas - Agente especializado</p>
					<p class="f-ts-16 ms-auto">{{ formatNumber(generalData.typeException) }}</p>
				</div>
				<div
					class="d-middle gap-x-2 rounded-xl bg-red-50 px-4 py-2 text-mid-gray-600 col-span-1 row-span-1 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
					<i class="icon-close-circle text-xl text-red-s-600" />
					<p class="f-tm-14">Reservas no concretadas</p>
					<p class="f-ts-16 ms-auto">{{ formatNumber(generalData.reservationCanceled) }}</p>
				</div>
			</div>
			<viewReservationAndAnalysis :idTime="idTime" />
			<viewGraphBottom :idTime="idTime" />
		</el-scrollbar>
	</section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { formatNumber } from '../utils/format.js'
import viewReservationAndAnalysis from '../partials/viewReservationAndAnalysis.vue';
import viewGraphBottom from '../partials/viewGraphBottom.vue'
import { ElNotification } from 'element-plus'
import { request } from "@request"
import { getGeneralStatistics } from '../services/dashboardService.js'

const loading = ref(false);
const error = ref(null);
const defaultGeneralData = {
	typeException: 0,
	reservationCanceled: 0,
	customers: 0,
	casesAttended: 0,
	casesEffective: 0,
	conversionRate: '0%'
};
const generalData = ref({ ...defaultGeneralData });
const idTime = ref(2); // valor por defecto


const optionsTime = ref([
	{ value: 1, label: 'Último mes' },
	{ value: 2, label: 'Trimestre' },
	{ value: 3, label: 'Semestre' },
	{ value: 4, label: 'Año' },
])

async function getGeneralStatisticsData() {
	loading.value = true;
	error.value = null;

	const { data, error: reqError } = await request(
		() => getGeneralStatistics({ tiempo: idTime.value }),
		false
	);

	if (reqError) {
		error.value = reqError;
		generalData.value = { ...defaultGeneralData };
		ElNotification({
			title: 'Error',
			message: reqError.response?.data?.error || 'Error al obtener estadísticas generales',
			type: 'error',
		});
	} else {
		generalData.value = data?.data ?? { ...defaultGeneralData };
	}

	loading.value = false;
}

onMounted(() => {
	getGeneralStatisticsData();
});

watch(idTime, () => {
	getGeneralStatisticsData();
});

</script>
