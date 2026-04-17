<template>
	<el-table :data="data" class="!w-fit table-sticky top-0">
		<el-table-column label="# Pre reserva" prop="number" width="120" />
		<el-table-column label="Fecha pre reserva" width="210">
			<template #default="scope">
				<p>{{ DateFormat(scope.row.checkInDate, 'DD MMM YYYY') }} - {{ DateFormat(scope.row.checkOutDate, 'DD MMM YYYY') }}</p>
			</template>
		</el-table-column>
		<el-table-column label="Sede de interés" prop="headquarter" width="170"/>
		<el-table-column label="Tipo alojamiento" width="105">
			<template #default="scope">
				<p>{{ scope.row.roomType ?? "-" }}</p>
			</template>
		</el-table-column>
		<el-table-column label="Nombre cliente" width="165">
			<template #default="scope">
				<p>{{ scope.row.customer ?? "-" }}</p>
			</template>
		</el-table-column>
		<el-table-column label="# Contacto" width="125">
			<template #default="scope">
				<p>{{ scope.row.contact ?? "-" }}</p>
			</template>
		</el-table-column>
		<el-table-column label="Categoría" prop="category" width="100" align="center">
			<template #default="scope">
				<p>{{ formatAffiliateCategory(scope.row.category) }}</p>
			</template>
		</el-table-column>
		<el-table-column label="Valor pago" width="100" align="right">
			<template #default="scope">
				<p>{{ currencyFormat(scope.row.valueTotal) }}</p>
			</template>
		</el-table-column>
		<el-table-column label="Historial IA" width="95" align="center">
			<template #default="scope">
				<i v-if="scope.row.idOpportunity" class="icon-document-text text-mid-gray-300 text-xl cursor-pointer"
					@click="openHistory(scope.row)" />
				<p v-else>N/A</p>
			</template>
		</el-table-column>
		<el-table-column label="Fecha cancelación automática" width="160">
			<template #default="scope">
				<p>{{ scope.row.dateCancelation ? DateFormat(scope.row.dateCancelation, 'DD MMM YYYY') : "-" }}</p>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup>
import { DateFormat } from '@/util/dateFormat.js'
import { currencyFormat } from '@/util/currencyFormat.js'

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

const emit = defineEmits(['openHistory'])

/* Functions */
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

function openHistory(row) {
	emit('openHistory', row)
}

</script>