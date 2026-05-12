<template>
	<ModalRight ref="refModalHistory" title="Historial" width="400" @close="handleClose">
		<div class="d-middle gap-x-4 mb-4">
			<p class="f-tm-14 me-auto">Ultima conversacion</p>
			<p class="f-tm-14">{{ info.lastConnection ? DateFormat(info.lastConnection, 'DD MMM YYYY HH:mm a') : '-' }}</p>
			<Button class="w-[36px] !p-0">
				<i class="icon-messages !text-lg" />
			</Button>
		</div>
		<el-scrollbar class="bg-blue-s-50" view-class="h-full p-4" style="height: calc(100vh - 200px);">
			<div v-loading="loading" class="vstack gap-y-3 pb-4 min-h-[120px]">
				<cardChat v-for="item in listChat" :key="item.id" :identify="item.type == 1"
					:type="item.type" :message="item.content" class="w-[295px]" />
				<div v-if="!loading && listChat.length === 0" class="d-middle-center h-[120px]">
					<p class="f-t-12 text-mid-gray-300">Sin mensajes</p>
				</div>
			</div>
		</el-scrollbar>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { DateFormat } from '@/util/dateFormat.js'
import { request } from "@request";
import cardChat from '../components/cardChat.vue';
import { getCustomerMessagesHistory } from '../services/clientService';

const refModalHistory = ref()

const loading = ref(false)
const idCustomerRef = ref(null)
const listChat = ref([])
const info = ref({
	lastConnection: null
})

/* Functions */
async function open(idCustomer, lastConnection = null) {
	if (!idCustomer || loading.value) return

	idCustomerRef.value = idCustomer
	info.value.lastConnection = lastConnection
	listChat.value = []
	refModalHistory.value.open()

	loading.value = true

	try {
		const { data, error } = await request(() => getCustomerMessagesHistory(idCustomer), false)

		if (error) {
			listChat.value = []
			return
		}

		listChat.value = Array.isArray(data) ? data : (data?.data || [])
	} finally {
		loading.value = false
	}
}

function handleClose() {
	idCustomerRef.value = null
	info.value.lastConnection = null
	listChat.value = []
}

defineExpose({
	open,
})
</script>
