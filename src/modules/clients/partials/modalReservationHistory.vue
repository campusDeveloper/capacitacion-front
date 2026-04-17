<template>
	<ModalRight ref="refModalReservation" title="Historial de reservas" width="400">
		<cardReservationHistory v-for="(value, index) in reservations" :key="index"
			:data="value" class="mb-4"
		/>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { request } from "@request";
import cardReservationHistory from '../components/cardReservationHistory.vue';

const refModalReservation = ref()

const reservations = ref([])

/* Functions */
async function open() {
	refModalReservation.value.open()
}

defineExpose({
	open
})

</script>