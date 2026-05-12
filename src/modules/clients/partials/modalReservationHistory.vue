<template>
	<ModalRight ref="refModalReservation" title="Historial de reservas" width="400" @close="handleClose">
		<div v-loading="loading" class="min-h-[120px]">
			<cardReservationHistory v-for="value in reservations" :key="value.id"
				:data="value" class="mb-4"
			/>
			<div v-if="!loading && reservations.length === 0" class="d-middle-center h-[120px]">
				<p class="f-t-12 text-mid-gray-300">Sin reservas</p>
			</div>
		</div>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { request } from "@request";
import cardReservationHistory from '../components/cardReservationHistory.vue';
import { getCustomerReservations } from '../services/clientService';

const refModalReservation = ref()

const loading = ref(false)
const idCustomerRef = ref(null)
const reservations = ref([])

/* Functions */
async function open(idCustomer) {
	if (!idCustomer || loading.value) return

	idCustomerRef.value = idCustomer
	reservations.value = []
	refModalReservation.value.open()

	loading.value = true

	try {
		const { data, error } = await request(() => getCustomerReservations(idCustomer), false)

		if (error) {
			reservations.value = []
			return
		}

		reservations.value = Array.isArray(data) ? data : (data?.data || [])
	} finally {
		loading.value = false
	}
}

function handleClose() {
	idCustomerRef.value = null
	reservations.value = []
}

defineExpose({
	open
})

</script>
