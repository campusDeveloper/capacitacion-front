<template>
	<div class="flex gap-x-8 h-[356px]">
		<div
			class="vstack shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] min-w-[347px] rounded-xl overflow-hidden bg-white-50">
			<div class="d-middle bg-brand-50 h-11 ps-4">
				<p class="text-mid-gray-600 f-ts-14">Leads por seguimiento</p>
			</div>
			<el-scrollbar view-class="bg-white-50 p-4">
				<div v-for="tracking in trackingData" :key="tracking.idTracking"
					class="hover:bg-dark-gray-50 rounded-lg p-3">
					<div class="d-middle-bt text-mid-gray-600">
						<div class="d-middle border h-[25px] px-2 w-fit rounded-lg"
							:style="`border-color: ${'#81C8A3'};`">
							<p class="f-t-14">{{ tracking.name }}</p>
						</div>
						<p class="f-tm-16">{{ tracking.totalLeads }}</p>
					</div>
					<div v-for="child in tracking.children" :key="child.idChildren" class="d-middle-bt ps-5 my-2">
						<p class="f-t-14">{{ child.childrenName }}</p>
						<p class="f-t-14 text-mid-gray-600">{{ child.totalChildrenLeads }}</p>
					</div>
				</div>
			</el-scrollbar>
		</div>
		<div
			class="vstack shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] min-w-[347px] rounded-xl overflow-hidden bg-white-50">
			<div class="d-middle bg-brand-50 h-11 ps-4">
				<p class="text-mid-gray-600 f-ts-14">Tipos de cliente</p>
			</div>
			<el-scrollbar view-class="p-4">
				<div v-for="client in clientData" :key="client.idType" class="hover:bg-dark-gray-50 rounded-lg p-3">
					<div class="d-middle-bt text-mid-gray-600">
						<div class="d-middle h-[25px] px-2 w-fit rounded-lg" :style="{ backgroundColor: client.color }">
							<p class="f-t-14">{{ client.name }}</p>
						</div>
						<p class="f-tm-16 text-mid-gray-600">{{ client.cantCustomers }}</p>
					</div>
				</div>
			</el-scrollbar>
		</div>
		<cardGraphics class="w-full">
			<div class="d-middle gap-x-4">
				<i class="icon-building-3 text-2xl" />
				<p class="text-mid-gray-600 f-tm-18">Reservas por Tipo alojamiento</p>
			</div>
			<Echarts :options="optionsReservation" width="100%" height="100%" />
		</cardGraphics>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Echarts from '@comp/Echarts.vue';
import { currencyFormat } from '@/util/currencyFormat.js'
import cardGraphics from '../components/cardGraphics.vue';
import { request } from "@request";


const props = defineProps({
	idTime: Number
});

const trackingData = ref([]);
const clientData = ref([]);
const reservationData = ref([]);
const loading = ref(false);
const yAxisData = computed(() =>
	reservationData.value.map(item => item.roomType)
);
const seriesData = computed(() =>
	reservationData.value.map(item => ({
		value: Number(item.totalRoomType) || 0,
		cases: item.valueTotal
	}))
);
const optionsReservation = computed(() => {
	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			backgroundColor: '#1F2122',
			borderColor: '#1F2122',
			formatter: function (params) {
				const content = params[0]
				return `
					<div style="width: 160px !important;">
						<p class="text-white-100 f-ts-14 pb-1">${content.axisValue}</p>
						<p class="text-white-700 f-t-12">Reservas: ${currencyFormat(content.value) || 0}</p>
						<p class="text-white-700 f-t-12">Valor: ${content.data.cases || 0}</p>
					</div>
				`
			}
		},
		grid: {
			left: '10%',
			right: '10%',
			bottom: '15%',
			top: '5%',
		},
		xAxis: {
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					color: '#ECECED'
				}
			},
			axisLabel: {
				interval: 0,
				color: '#5D5D5D',
			},
		},
		yAxis: {
			type: 'category',
			data: yAxisData.value ?? [],
			axisLabel: {
				width: 113,
				overflow: 'break',
				lineHeight: 16,
				color: '#5D5D5D',
				fontFamily: 'GoogleSansFlex-Regular-24pt',
				fontSize: 12
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#ECECED',
					width: 1
				}
			},
			animationDuration: 300,
			animationDurationUpdate: 300,
		},
		series: {
			name: 'Direct',
			type: 'bar',
			stack: 'total',
			label: {
				show: true,
				position: 'right',
				formatter: '{c}',
				color: '#3B3F42',
				fontFamily: 'GoogleSansFlex-Medium',
				fontWeight: 500,
				fontSize: 16,
				valueAnimation: true,
			},
			emphasis: {
				focus: 'series'
			},
			data: seriesData.value,
			barWidth: '30',
			itemStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 1,
					y2: 0,
					colorStops: [
						{ offset: 0, color: '#FDF6EC' },
						{ offset: 1, color: '#F1B96A' }
					]
				},
				borderRadius: [0, 8, 8, 0]
			}
		},
		animationDuration: 0,
		animationDurationUpdate: 600,
		animationEasing: 'linear',
		animationEasingUpdate: 'linear'
	}
})

//Funciones


</script>