<template>
	<div class="vstack overflow-hidden h-full">
		<div class="d-middle gap-x-2">
			<i class="icon-arrow-outline-left text-2xl text-mid-gray-300 cursor-pointer" @click="goBacklistSent" />
			<p class="f-ts-18 text-mid-gray-600">Nueva difusión</p>
		</div>
		<div class="vstack overflow-hidden h-full px-6 pt-6 pb-2">
			<div class="flex text-black-300 f-tm-14 items-end overflow-hidden z-[2] gap-x-4">
				<p class="f-tm-16 text-mid-gray-600 me-auto">Lista de clientes ({{ amountSelected }})</p>
				<div class="d-middle bg-blue-50 rounded-lg h-[26px] w-[330px] px-2">
					<i class="icon-info-circle text-lg text-brand-500" />
					<p class="f-t-12 text-blue-s-700">Recuerda que solo puedes enviar 500 mensajes al día</p>
				</div>
				<el-tooltip content="Seleccionar desde archivo" placement="top">
					<Button type-style="tertiary" class="!p-0" @click="openSelectFile">
						<i class="icon-document-upload !text-xl" />
					</Button>
				</el-tooltip>
				<el-tooltip content="Filtros" placement="top">
					<Button type-style="tertiary" class="!p-0" @click="onToggleFilter">
						<i class="icon-setting-3 !text-xl" />
					</Button>
				</el-tooltip>
				<Button v-if="!templateSelected" @click="openSelectTemplate" class="!min-w-[158px]">Seleccionar
					plantilla</Button>
				<Button @click="goBacklistSent" class="!min-w-[110px]" type-style="danger">Cancelar</Button>
				<Button v-if="templateSelected" :disabled="!amountSelected" @click="openMassMessaging"
					class="!min-w-[210px]"> Enviar ({{ amountSelected }} seleccionados)</Button>
			</div>
			<div
				:class="['transition-all ease-linear duration-150 my-3', showFilter ? 'min-h-[61px] max-h-[61px] opacity-100' : 'min-h-[0px] max-h-[0px] opacity-0']">
				<div class="flex justify-end items-end gap-x-4 f-tm-14 overflow-hidden min-h-[61px]">
					<div class="w-[190px]">
						<p class="pb-1">Tipo de cliente </p>
						<el-select v-model="options.idType" placeholder="Seleccionar" popper-class="!max-w-[210px]"
							@change="onFilterData" clearable>
							<el-option v-for="item in optionsClients" :key="item.idType" :label="item.name"
								:value="item.idType">
							</el-option>
						</el-select>
					</div>
					<div class="w-[190px]">
						<p class="pb-1">Seguimiento </p>
						<el-select v-model="filters.idTracking" placeholder="Seleccionar" popper-class="!max-w-[210px]"
							clearable>
							<el-option v-for="item in optionsFollowUp" :key="item.idTracking" :label="item.name"
								:value="item.idTracking">
							</el-option>
						</el-select>
					</div>
					<div class="w-[190px]">
						<p class="pb-1">Estado seguimiento </p>
						<el-select :key="filters.idTracking" v-model="filters.idTrackingStatus"
							placeholder="Seleccionar" popper-class="!max-w-[210px]" :disabled="!filters.idTracking"
							@change="onFilterData" clearable>
							<el-option v-for="item in optionsTrackingStatus" :key="item.idTracking" :label="item.name"
								:value="item.idTracking">
							</el-option>
						</el-select>
					</div>
					<div class="w-[190px]">
						<p class="pb-1">Sede de interés </p>
						<el-select v-model="options.idHeadquarter" placeholder="Seleccionar"
							popper-class="!max-w-[210px]" @change="onFilterData" clearable>
							<el-option v-for="item in optionsHeadquarter" :key="item.idHeadquarter" :label="item.name"
								:value="item.idHeadquarter">
							</el-option>
						</el-select>
					</div>
					<Button class="!w-[112px]" type-style="tertiary" @click="onFilterData">Filtrar</Button>
				</div>
			</div>
		</div>
		<div v-if="templateSelected" class="d-middle gap-x-4 mb-5">
			<p class="f-tm-14">Plantilla seleccionada:</p>
			<cardTemplate class="!cursor-default !bg-white-50 w-[362px]" :data="refCardTemplate"
				@handleActionEye="openTemplatePreview">
				<template #actions>
					<i class="icon-close text-mid-gray-300 cursor-pointer" @click="openRemoveTemplate" />
				</template>
			</cardTemplate>
		</div>
		<el-table :data="dataListCustomer" class="!w-fit table-sticky" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" />
			<el-table-column label="Nombre" prop="name" width="225" />
			<el-table-column label="# Teléfono" prop="phone" width="150" />
			<el-table-column label="Tipo de cliente" width="150">
				<template #default="{ row }">
					<div class="d-middle-center rounded-lg h-[26px] w-[117px]"
						:style="`background-color: ${row.typeColor};`">
						<p class="text-black-300 f-t-12">{{ row.customerType }}</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="Estado seguimiento" prop="statusTracking" width="210">
			</el-table-column>
			<el-table-column label="Sede interés" prop="headquarter" width="285" />
		</el-table>
		<!-- <EmptyView v-else style="height: calc(100vh - 260px);" imgUrl="/img/illustrations/chatbot.svg"
			:data="{ title: 'Sin plantilla', description: 'Selecciona una plantilla y luego los clientes para enviar la mensajería' }" /> -->
		<modalMessageSent ref="refModalSendingMessaging" @close="closeSendingMessaging" />
		<modalSelectFromFile ref="refModalSelectFromFile" @currentTemplate="handleCurrentTemplate" />
		<modalSelectTemplate ref="refModalSelectTemplate" @handleTemplate="handleTemplate" />
		<modalPreviewTemplate ref="refModalPreviewTemplate" />
		<Modal ref="refModalSendmassMessaging" width="382" type="danger" action="Enviar"
			title="Enviar mensajería masiva" :onAction="handleSendmassMessaging">
			<p class="text-center">¿Estás seguro de enviar la mensajería? Una vez enviada, no podrás deshacer esta
				acción.</p>
			<p class="text-center f-tm-16 mt-4 mb-1">{{ amountSelected }} Clientes seleccionados</p>
		</Modal>
		<Modal ref="refModalRemoveTemplate" width="382" type="danger" action="Quitar" title="Quitar plantilla"
			:onAction="handleRemoveTemplate">
			<p>¿Deseas quitar la plantilla? Al hacerlo, deberás volver a seleccionar una de la lista.</p>
		</Modal>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Tags from '@comp/Tags.vue'
import cardTemplate from '../components/cardTemplate.vue'
import modalMessageSent from '../partials/modalMessageSent.vue'
import modalSelectFromFile from '../partials/modalSelectFromFile.vue'
import modalSelectTemplate from '../partials/modalSelectTemplate.vue'
import modalPreviewTemplate from '../partials/modalPreviewTemplate.vue'
import { request } from "@request";

const refModalSendmassMessaging = ref()
const refModalSendingMessaging = ref()
const refModalSelectFromFile = ref()
const refModalRemoveTemplate = ref()
const refModalSelectTemplate = ref()
const refModalPreviewTemplate = ref()
const refModalMessageSent = ref()
const refCardTemplate = ref(null)


const dataList = ref([])
const dataListCustomer = ref([])
const showFilter = ref(false)
const templateSelected = ref(false)
const amountSelected = ref(0)
const router = useRouter()
const selectedCustomers = ref([])

const options = ref({
	idType: null,
	idHeadquarter: null,
})

const optionsClients = ref([]);
const optionsFollowUp = ref([]);
const optionsHeadquarter = ref([]);

const filters = reactive({
	idTracking: null,
	idTrackingStatus: null
})
const optionsTrackingStatus = [
	{ idTracking: 1, name: 'Sin iniciar' },
	{ idTracking: 2, name: 'En proceso' },
	{ idTracking: 3, name: 'Finalizado' },
]

function goBacklistSent() {
	router.push({ name: 'massMessages.main' })
}

function openTemplatePreview() {
	refModalPreviewTemplate.value.open()
}

function openSelectTemplate() {
	refModalSelectTemplate.value.open()
}

function handleSelectionChange() {
}

async function handleTemplate() {
	refModalSelectTemplate.value.close()
}

function handleCurrentTemplate() {
}



function openMassMessaging() {
	refModalSendmassMessaging.value.open()
}

async function handleSendmassMessaging() {
	
}

function closeSendingMessaging() {
}

function onToggleFilter() {
	showFilter.value = !showFilter.value
}

function onFilterData() {
	
}

function openSelectFile() {
	refModalSelectFromFile.value.open();
}

function openRemoveTemplate() {
	refModalRemoveTemplate.value.open()
}

function handleRemoveTemplate() {
	refModalRemoveTemplate.value.close()
}

</script>