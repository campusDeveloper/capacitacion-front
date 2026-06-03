<template>
	<div class="flex gap-x-8 h-[483px]">
		<cardGraphics class="w-[41%]">
			<div class="d-middle gap-x-4">
				<img src="/img/icons/buildings.svg" alt="">
				<p class="text-mid-gray-600 f-tm-18">Reservas por sede</p>
			</div>
			<Echarts :options="optionsReservation" width="100%" height="100%" />
		</cardGraphics>
		<cardGraphics class="w-[59%]">
			<div class="d-middle gap-x-2">
				<i class="icon-user-square text-2xl" />
				<p class="text-mid-gray-600 f-tm-18 me-auto">Comparativo año actual</p>
				<el-select v-model="idYear" placeholder="" class="!w-[137px]">
					<el-option v-for="item in optionsYears" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<Echarts :options="optionsComparative" width="100%" height="100%" />
		</cardGraphics>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Echarts from '@comp/Echarts.vue';
import { formatCurrencyCOP, formatNumber } from '../utils/format.js'
import cardGraphics from '../components/cardGraphics.vue';
import { request } from "@request"
import { getReservationsHeadquarters, getComparativeYearMetrics } from '../services/dashboardService.js'

const props = defineProps({
	idTime: Number
});
const loading = ref(false);
const error = ref(null);
const headquarterData = ref([]);
const comparativeData = ref([]);
const currentYear = new Date().getFullYear();
const optionsYears = computed(() =>
	Array.from({ length: 5 }, (_, index) => {
		const year = currentYear - index - 1;
		return { value: year, label: String(year) };
	})
);

const idYear = ref(currentYear - 1);

function normalizeHeadquartersData(apiData) {
	return apiData.map(item => ({
		name: item.name,
		reservationsTotal: Number(item.reservationTotal) || 0,
		valueTotal: item.valueTotal
	}));
}

async function getHeadquartersData() {
	loading.value = true;
	error.value = null;

	const { data, error: reqError } = await request(
		() => getReservationsHeadquarters({ tiempo: props.idTime }),
		false
	);

	if (reqError) {
		error.value = reqError;
		headquarterData.value = [];
	} else {
		headquarterData.value = normalizeHeadquartersData(data?.data ?? []);
	}

	loading.value = false;
}

async function getComparativeData() {
    loading.value = true;
    error.value = null;

    const { data, error: reqError } = await request(
        () => getComparativeYearMetrics({ tiempo: props.idTime, year: idYear.value }),
        false
    );

    if (reqError) {
        error.value = reqError;
        comparativeData.value = [];
    } else {
        comparativeData.value = data?.data ?? [];
    }

    loading.value = false;
}

const yReservationData = computed(() =>
	headquarterData.value.map(item => item.name)
);
const seriesReservationData = computed(() =>
	headquarterData.value.map(item => ({
		value: Number(item.reservationsTotal) || 0,
		cases: item.valueTotal
	}))
);


const currentYearData = computed(() =>
	comparativeData.value?.yearCurrent?.map(item => ({
		value: item.totalReservations,
		monthName: item.monthName,
		year: item.year
	})) ?? []
);

const lastYearData = computed(() =>
	comparativeData.value?.yearLast?.map(item => ({
		value: item.totalReservations,
		monthName: item.monthName,
		year: item.year
	})) ?? []
);

const comparativeMonths = computed(() => {
	const months = currentYearData.value.length ? currentYearData.value : lastYearData.value;
	return months.map(item => item.monthName);
});

const currentYearLabel = computed(() =>
	currentYearData.value[0]?.year ? String(currentYearData.value[0].year) : 'Año actual'
);

const lastYearLabel = computed(() =>
	lastYearData.value[0]?.year ? String(lastYearData.value[0].year) : String(idYear.value)
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
						<p class="text-white-700 f-t-12">Reservas: ${formatNumber(content.value)}</p> 
						<p class="text-white-700 f-t-12">Valor: ${formatCurrencyCOP(content.data.cases)}</p>
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
			data: yReservationData.value,
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
				formatter: function (params) {
					return formatNumber(params.value);
				},
				color: '#5D5D5D',
				fontFamily: 'GoogleSansFlex-Medium',
				fontWeight: 500,
				fontSize: 16,
				valueAnimation: true,
			},
			emphasis: {
				focus: 'series'
			},
			data: seriesReservationData.value,
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

const optionsComparative = computed(() => {
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
				const current = params.find(p => p.seriesName === currentYearLabel.value)
				const last = params.find(p => p.seriesName === lastYearLabel.value)
				return `
					<div style="width: 103px !important;">
						<p class="text-white-100 f-ts-14 pb-1">Reservaciones ${content.axisValue}</p>
						<p class="text-white-500 f-t-13">${current?.marker ?? ''} ${currentYearLabel.value}: ${formatNumber(current?.value ?? 0)}</p>
						<p class="text-white-500 f-t-13">${last?.marker ?? ''} ${lastYearLabel.value}: ${formatNumber(last?.value ?? 0)}</p>
					</div>
				`
			}
		},
		grid: {
			left: '-10%',
			right: '5%',
			bottom: '15%',
			top: '16%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			splitLine: {
				show: false
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#ECECED',
					width: 1
				}
			},
			axisLabel: {
				interval: 0,
				color: '#5D5D5D',
			},
			data: comparativeMonths.value
		},
		yAxis: {
			type: 'value',
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
		series: [
			{
				name: currentYearLabel.value,
				type: 'bar',
				stack: 'total',
				label: {
					show: true,
					position: 'top',
					formatter: function (params) {
						return formatNumber(params.value);
					},
					color: '#3B3F42',
					fontFamily: 'GoogleSansFlex-Medium',
					fontWeight: 500,
					fontSize: 16,
					valueAnimation: true,
				},
				data: currentYearData.value,
				barWidth: '30',
				itemStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 1.2,
						x2: 0,
						y2: 0,
						colorStops: [
							{ offset: 1, color: '#214684' },
							{ offset: 0, color: '#E9EDF3' }
						]
					},
					borderRadius: [8, 8, 0, 0]
				}
			},
			{
				name: lastYearLabel.value,
				data: lastYearData.value,
				type: 'line',
				symbol: 'circle',
				symbolSize: 8,
				lineStyle: {
					color: '#F3C482'
				},
				itemStyle: {
					color: '#EDA745'
				}
			}
		]
	}
})

onMounted(() => {
	getHeadquartersData();
	getComparativeData();
});

watch(idYear, () => {
    getComparativeData();
});

watch(() => props.idTime, () => {
	getHeadquartersData();
	getComparativeData();
});

</script>
