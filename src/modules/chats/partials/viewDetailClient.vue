<template>
	<div class="vstack items-center bg-white-500 p-4 min-w-[300px] max-w-[300px] gap-y-2 border-s border-white-600">
		<div class="flex w-full gap-x-4">
			<PhotoUser classPhoto="size-[48px]" :photo="info?.photo">
				<div
					class="d-middle-center absolute -right-1 -bottom-1 rounded-full text-white-100 f-t-14 bg-orange-600 size-[20px]">
					{{ capitalize(info.name) }}
				</div>
			</PhotoUser>
			<div class="vstack gap-y-1 text-mid-gray-600">
				<p class="f-tm-12">{{ info.name }}</p>
				<p class="f-t-12">{{ formatPhoneGeneral(info.phone) }}</p>
				<div class="d-middle gap-x-2">
					<p class="f-t-12 text-black-300">Categoría: <span>{{ formatAffiliateCategory(info.affiliateCategory) }}</span></p>
					<el-tooltip v-if="info.numberReservation" content="N° Reserva" placement="top">
						<Tags class="w-fit !rounded-full !pt-0 !h-[19px] !px-2" size="xsmall"
						:text="`N° ${ info.numberReservation }`" type-style="info" />
					</el-tooltip>
				</div>
			</div>
		</div>
		<div class="d-middle gap-x-2 w-full mt-2">
			<p v-if="info.alternativePayment !== 0" class="f-tm-12 me-auto">Pago</p>
			<Tags v-if="info.alternativePayment === 1" class="w-fit !rounded-full !pt-0 !h-[19px] !px-2" size="xsmall" text="Gestionar Pago" type-style="disabled" />
			<Tags v-if="info.alternativePayment === 2" class="w-fit !rounded-full !pt-0 !h-[19px] !px-2" size="xsmall" text="Confirmado" type-style="success" />
			<Tags v-if="info.alternativePayment === 3" class="w-fit !rounded-full !pt-0 !h-[19px] !px-2" size="xsmall" text="No confirmado" type-style="disabled" />
			<Button v-if="info.alternativePayment !== 0" size="xsmall" type-style="tertiary" class="!p-0" @click="openManagePayment">
				<i class="icon-money-send"/>
			</Button>
		</div>
		<div class="w-full">
			<p class="f-tm-12 pb-1 pt-2">Seguimiento</p>
			<SelectStatusFollowUp v-if="optionsTracking.length > 0" :disabled="loading" v-model="info.idOpportunityTracking" isOutline :options="optionsTracking" @change="updateOpportunityChangeTracking($event)" />
		</div>
		<div class="w-full">
			<p class="f-tm-12 pb-1 pt-2">Sede de interés</p>
			<el-select :disabled="loading || info.numberReservation" v-model="info.idHeadquarter" size="small" placeholder="Seleccionar"
				@change="updateOpportunityChangeHeadquarter">
				<el-option v-for="item in optionsHeadquarters" :key="item.idHeadquarter" :label="item.name"
					:value="item.idHeadquarter">
				</el-option>
			</el-select>
		</div>
		<div class="w-full">
			<p class="f-tm-12 pb-1 pt-2">Responsable</p>
			<el-select :disabled="loading" v-model="info.idUserAssigned" size="small" placeholder="Seleccionar"
				@change="updateOpportunityChangeUser">
				<el-option v-for="item in optionsResponsible" :key="item.idUser" :label="item.name"
					:value="item.idUser">
				</el-option>
			</el-select>
		</div>
		<p class="f-tm-12 text-mid-gray-600">Comentarios</p>
		<el-scrollbar class="pe-3">
			<CardComments v-for="item in opportunitiesComments" :key="item.idComment" class="!gap-x-4 mb-3"
				className="f-tm-10" classDown="f-t-10" :info="item" />
		</el-scrollbar>
		<TextField v-model="writeMessage" placeholder="Deja un comentario" :autosize="{ minRows: 2, maxRows: 2 }"
			@sendMessage="sendNewComment" :maxlength="250" class="mt-auto" />
		<modalManagePayment ref="refModalManagePayment" @submitData="createPaymentChat" />
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { formatPhoneGeneral } from '@/util/formatPhoneNumber';
import { request } from "@request";
import PhotoUser from '@comp/PhotoUser.vue';
import TextField from '@comp/TextField.vue';
import CardComments from '@comp/CardComments.vue';
import SelectStatusFollowUp from '@comp/SelectStatusFollowUp.vue'
import Tags from '@comp/Tags.vue';
import modalManagePayment from './modalManagePayment.vue'
import {
	createOpportunityComment,
	getBusinessUsersOptions,
	getHeadquartersOptions,
	getOpportunityComments,
	getTrackingOptions,
	updateLeadAssignedUser,
} from '../services/chatService';

const refModalManagePayment = ref()

const props = defineProps({
	info: {
		type: Object,
		required: true
	}
})

const writeMessage = ref('')

const loading = ref(false)

const opportunitiesComments = ref([])

const optionsTracking = ref([])

const optionsHeadquarters = ref([])

const optionsResponsible = ref([])
const emit = defineEmits(['refresh'])

/* Async Functions */


async function createPaymentChat(payload) {
	
}

async function updateOpportunityChangeUser(idUser) {
	if (!idUser) return
	loading.value = true
	const { error } = await request(() => updateLeadAssignedUser(props.info.idOpportunity, idUser), true)
	if (!error) emit('refresh')
	loading.value = false
}

async function updateOpportunityChangeTracking(idTrackingChildren) {
	
}

async function updateOpportunityChangeHeadquarter(idHeadquarter) {
	
}


async function sendNewComment(message) {
	const comment = (message ?? writeMessage.value).trim()
	if (!comment) return

	loading.value = true
	const { error } = await request(() => createOpportunityComment(props.info.idOpportunity, comment), true)
	if (!error) await loadComments()
	loading.value = false
}

/* Functions */
function openManagePayment() {
	refModalManagePayment.value.open()
}

function formatAffiliateCategory() {
	switch (props.info.affiliateCategory) {
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

function capitalize(name) {
	if (!name?.trim()) return ''

	return name.trim()[0].toUpperCase()
}

async function loadInitialData() {
	loading.value = true

	const [tracking, headquarters, responsible, comments] = await Promise.all([
		request(() => getTrackingOptions(), { success: false }),
		request(() => getHeadquartersOptions(), { success: false }),
		request(() => getBusinessUsersOptions(), { success: false }),
		request(() => getOpportunityComments(props.info.idOpportunity), { success: false }),
	])

	optionsTracking.value = tracking.data?.data ?? []
	optionsHeadquarters.value = headquarters.data?.data ?? []
	optionsResponsible.value = responsible.data?.data ?? []
	opportunitiesComments.value = normalizeComments(comments.data?.data ?? [])
	loading.value = false
}

async function loadComments() {
	const { data, error } = await request(() => getOpportunityComments(props.info.idOpportunity), { success: false })
	if (!error) opportunitiesComments.value = normalizeComments(data?.data ?? [])
}

function normalizeComments(comments) {
	return comments.map(comment => ({
		idComment: comment.idComment ?? comment.IdComment,
		comment: comment.comment ?? comment.Comment,
		createdAt: comment.createdAt ?? comment.CreatedAt,
		creator: {
			name: comment.creator?.name ?? comment.user,
		},
	}))
}

watch(() => props.info?.idOpportunity, (idOpportunity) => {
	if (idOpportunity) loadInitialData()
}, { immediate: true })

</script>
