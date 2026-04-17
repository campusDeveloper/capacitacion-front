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
			<cardGraphics class="flex gap-x-5">
				<div
					class="vstack justify-center rounded-lg bg-brand-50 px-4 py-2 text-mid-gray-600 min-w-[196px] h-[83px]">
					<p class="f-ts-18 pb-1">Clientes totales</p>
					<p class="f-tm-16">{{ generalData.customers }}</p>
				</div>
				<div class="flex flex-wrap gap-x-5 gap-y-3">
					<div class="d-middle gap-x-2 bg-white-300 rounded-xl w-[459px] h-[40px] ps-2 pe-4">
						<i class="icon-message-notif text-xl text-brand-500" />
						<p class="f-tm-14">Casos atendidos</p>
						<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ generalData.casesAttended }}</p>
					</div>
					<el-tooltip content="Cantidad de reservas concretadas" placement="top">
						<div class="d-middle gap-x-2 bg-white-300 rounded-xl w-[459px] h-[40px] ps-2 pe-4">
							<i class="icon-cup text-xl text-brand-500" />
							<p class="f-tm-14">Reservas efectivas</p>
							<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ currencyFormat(99999999) }}</p>
						</div>
					</el-tooltip>
					<div class="d-middle gap-x-2 bg-white-300 rounded-xl w-[459px] h-[40px] ps-2 pe-4">
						<i class="icon-cup text-xl text-brand-500" />
						<p class="f-tm-14">Casos efectivos</p>
						<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ generalData.casesEffective }}</p>
					</div>
					<el-tooltip content="Leads atendidos vs concretaron reservas" placement="top">
						<div class="d-middle gap-x-2 bg-green-50 rounded-xl w-[459px] h-[40px] px-4">
							<p class="f-tm-14">Tasa de conversión</p>
							<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ generalData.conversionRate }}</p>
						</div>
					</el-tooltip>
				</div>
			</cardGraphics>
			<cardGraphics class="flex gap-x-3">
				<div class="d-middle bg-white-300 rounded-xl w-full h-[40px] ps-2 pe-4">
					<i class="icon-magic-star text-xl text-brand-500 pe-1" />
					<p class="f-tm-14">Reservas - Agente especializado</p>
					<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ generalData.typeException }}</p>
				</div>
				<div class="d-middle gap-x-2 bg-white-300 rounded-xl w-full h-[40px] ps-2 pe-4">
					<i class="icon-money-send text-xl text-brand-500" />
					<p class="f-tm-14">Reservas - Agente pagos</p>
					<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ currencyFormat(99999999) }}</p>
				</div>
				<div class="d-middle gap-x-2 bg-red-50 rounded-xl w-full h-[40px] ps-2 pe-4">
					<i class="icon-close-circle text-xl text-red-s-600" />
					<p class="f-tm-14">Reservas no concretadas</p>
					<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ generalData.reservationCanceled }}</p>
				</div>
			</cardGraphics>
			<viewReservationAndAnalysis :idTime="idTime" />
			<viewGraphBottom :idTime="idTime" />
		</el-scrollbar>
	</section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { currencyFormat } from '@/util/currencyFormat.js'
import cardGraphics from '../components/cardGraphics.vue';
import viewReservationAndAnalysis from '../partials/viewReservationAndAnalysis.vue';
import viewGraphBottom from '../partials/viewGraphBottom.vue'
import { request } from "@request"

const loading = ref(false);
const generalData = ref([]);
const idTime = ref(2); // valor por defecto


const optionsTime = ref([
	{ value: 1, label: 'Último mes' },
	{ value: 2, label: 'Trimestre' },
	{ value: 3, label: 'Semestre' },
	{ value: 4, label: 'Año' },
])



</script>