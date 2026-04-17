<template>
	<div class="vstack overflow-hidden h-full">
		<div class="d-middle rounded-lg bg-brand-50 p-4 mb-12">
			<img src="/img/illustrations/messages.svg" alt="">
			<p class="f-t-12">En esta sección podrás gestionar el envío de mensajes de manera centralizada,
				seleccionando cualquiera de las plantillas previamente creadas. Permite elegir uno o varios clientes
				desde una lista organizada, definir los destinatarios y realizar envíos de forma eficiente, asegurando
				una comunicación controlada, consistente y alineada con tus objetivos operativos.</p>
		</div>
		<div class="d-middle gap-x-4">
			<p class="text-mid-gray-600 f-tm-16 me-auto">Lista de enviados</p>
			<el-input v-model="search" placeholder="Buscar" class="relative !w-[250px]">
				<template #suffix>
					<Button type-style="tertiary" class="absolute right-0 !rounded-lg !p-0" @click="handleSearch">
						<i class="icon-search !text-xl" />
					</Button>
				</template>
			</el-input>
			<Button type-style="tertiary" class="!min-w-[158px]" :disabled="dataList.length === 0 || loadingExport"
				@click="downloadReport">{{
					loadingExport ?
						"Descargando..." : "Descargar" }}
				reporte</Button>
			<Button class="!w-[148px]" :disabled="dataInformationList.last24Hours >= dataInformationList.maxMessages"
				@click="showMassMessages">Nueva
				difusión</Button>
		</div>
		<div class="d-middle gap-x-4 my-5">
			<div class="d-middle bg-white-300 rounded-xl h-[40px] w-[277px] gap-x-2 px-3">
				<i class="icon-send text-xl text-brand-500 -rotate-[25deg]" />
				<p class="f-tm-14">Envíos en las últimas 24h</p>
				<p class="f-ts-16 text-mid-gray-600 ms-auto">{{ dataInformationList.last24Hours }}</p>
			</div>
			<div class="d-middle rounded-lg h-[26px] w-[330px] px-2" :class="{
				'bg-blue-50': dataInformationList.last24Hours < dataInformationList.maxMessages,
				'bg-red-100': dataInformationList.last24Hours >= dataInformationList.maxMessages
			}">
				<i class="icon-info-circle text-lg" :class="dataInformationList.last24Hours >= dataInformationList.maxMessages
					? 'text-red-600'
					: 'text-brand-500'" />
				<p class="f-t-12" :class="dataInformationList.last24Hours >= dataInformationList.maxMessages
					? 'text-red-700'
					: 'text-blue-s-700'">
					Recuerda que solo puedes enviar {{ dataInformationList.maxMessages }}
					mensajes al día
				</p>
			</div>
		</div>
		<el-table :data="filteredData" class="!w-fit table-sticky" row-class-name="cursor-pointer"
			@row-click="openSendingSummary">
			<el-table-column label="Plantilla" width="224">
				<template #default="{ row }">
					<p>Plantilla _{{ row.code }}</p>
				</template>
			</el-table-column>
			<el-table-column label="Estado envío" width="125">
				<template #default="{ row }">
					<Tags :text="row.state == 1 ? 'En curso' : 'Completado'"
						:typeStyle="row.state === 1 ? 'info' : 'success'" class="w-fit" />
				</template>
			</el-table-column>
			<el-table-column label="Total" width="100" align="right">
				<template #default="{ row }">
					<p>{{ currencyFormat(row.total) }}</p>
				</template>
			</el-table-column>
			<el-table-column label="Exitosos" width="90" align="center">
				<template #default="{ row }">
					<p>{{ currencyFormat(row.successful) }}</p>
				</template>
			</el-table-column>
			<el-table-column label="Fallidos" width="90" align="center">
				<template #default="{ row }">
					<p>{{ currencyFormat(row.failed) }}</p>
				</template>
			</el-table-column>
			<el-table-column label="Fecha de envio" prop="fechaEnvio" width="150" sortable>
				<template #default="{ row }">
					<p>{{ DateFormat(row.createdAt, 'DD MMM YYYY') }}</p>
				</template>
			</el-table-column>
		</el-table>
		<modalSendingSummary ref="refModalSendingSummary" />
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Tags from '@comp/Tags.vue'
import { currencyFormat } from '@/util/currencyFormat.js'
import { DateFormat } from '@/util/dateFormat';
import modalSendingSummary from '../partials/modalSendingSummary.vue';
import { request } from "@request";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const refModalSendingSummary = ref()
const search = ref('')
const dataList = ref([])
const dataInformationList = ref([])
const loadingExport = ref(false);


function handleSearch() {
	search.value = search.value.trim()
}

function openSendingSummary() {
	refModalSendingSummary.value.open();
}

function showMassMessages() {
	router.push({ name: 'massMessages.newDiffusion' })
}

</script>