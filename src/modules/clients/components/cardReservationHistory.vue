<template>
	<div class="vstack rounded-2xl bg-brand-50 min-h-[180px] text-mid-gray-600 relative pe-6 py-3 ps-10 gap-y-[4px]">
		<div class="absolute bg-white-50 rounded-full -left-10 translate-y-[70%] size-[63px]"/>
		<div class="flex justify-between gap-x-3">
			<p class="f-tm-14">{{ data.headquarter }}</p>
			<p class="f-t-12 text-blue-s-700">#{{ data.number }}</p>
		</div>
		<div class="d-middle">
			<i class="icon-calendar-fill text-mid-gray-300 text-base"/>
			<p class="f-t-12 ps-1">{{ DateFormat(data.checkInDate, 'DD MMM YYYY') }} - {{ DateFormat(data.checkOutDate, 'DD MMM YYYY') }}</p>
		</div>
		<div class="d-middle">
			<i class="icon-house-2 text-mid-gray-300 text-base"/>
			<p class="f-t-12 ps-1">Alojamiento: {{ data.roomType }}</p>
		</div>
		<div class="d-middle">
			<i class="icon-profile-2user text-mid-gray-300 text-base"/>
			<p class="f-t-12 ps-1">Cant. personas: {{ data.countGuests }}</p>
		</div>
		<p class="f-tm-14">Valor: {{ currencyFormat(data.value) }}</p>
	</div>
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

</script>