<template>
	<div :class="['flex p-3 rounded-lg bg-white-50 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] cursor-pointer border border-[transparent]',
		selected ? 'border-green-s-400' : 'hover:bg-white-300'
	]">
		<PhotoUser :photo="data.photo">
			<el-tooltip v-if="data.userAssigned" :content="data.userAssigned" placement="top" :offset="25">
				<div class="d-middle-center absolute -right-1 -bottom-1 rounded-full text-white-100 f-t-10 bg-orange-600 size-4">
					{{ getFirstLetter(data.userAssigned) }}
				</div>
			</el-tooltip>
		</PhotoUser>
		<div class="vstack gap-y-1 text-black-300 w-fit me-auto ms-5">
			<p class="text-mid-gray-600 f-tm-14">{{ data.name }}</p>
			<p class="f-t-12">{{ formatPhoneGeneral(data.phone) }}</p>
			<div v-if="data.headquarter" class="d-middle gap-x-1">
				<i class="icon-building-4 text-[rgb(var(--xx-color-icons-primary))]" />
				<p class="f-t-12">{{ data.headquarter }}</p>
			</div>
			<div class="d-middle gap-x-2">
				<Tags v-if="data.opportunityState" class="w-fit !rounded-full !pt-0 !h-[19px] !px-2" size="xsmall"
					:text="data.opportunityState" :color="data.opportunityStateColor" />
				<el-tooltip v-if="data.numberReservation" content="N° Reserva" placement="top">
					<Tags class="w-fit !rounded-full !pt-0 !h-[19px] !px-2" size="xsmall"
					:text="`N° ${ data.numberReservation }`" type-style="disabled" />
				</el-tooltip>
			</div>
		</div>
		<div v-if="data.chat" class="vstack items-end gap-y-2 w-fit">
			<p class="f-t-12">{{ DateFormat(data.lastConnection, 'HH:mm a') }}</p>
			<div class="d-middle gap-x-1">
				<el-tooltip v-if="data.exception" :content=data.exception placement="top">
					<i class="icon-info-circle text-red-s-600" />
				</el-tooltip>
				<div class="d-middle bg-brand-500 h-[19px] px-2 gap-x-1 w-fit rounded-lg">
					<p class="f-t-10 text-white-100">{{ data.chat.mode === 1 ? 'IA' : 'Admin' }}</p>
					<img :src="data.chat.mode == 1 ? '/img/icons/monitor.svg' : '/img/icons/user.svg'" alt="">
				</div>
			</div>
			<el-tooltip placement="top">
				<div class="w-fit bg-brand-300 rounded text-white-100 h-[14px] px-1 f-t-10">
					{{ data.chat.unreadMessages }}
				</div>
				<template #content>
					{{ "Total mensajes: " + data.chat.totalMessages }}
					<br/>
					{{ "Sin leer: " + data.chat.unreadMessages }}
				</template>
			</el-tooltip>
			<el-tooltip :content="`Agente ${ data.alternativePayment === 0 ? 'especializado': 'pago' }`" placement="top">
				<i :class="['text-base -me-[5px]', data.alternativePayment === 0 ? 'icon-magic-star text-brand-500': 'icon-dollar-circle text-green-s-500']"/>
			</el-tooltip>
		</div>
	</div>
</template>

<script setup>
import PhotoUser from '@comp/PhotoUser.vue';
import Tags from '@comp/Tags.vue';
import { formatPhoneGeneral } from '@/util/formatPhoneNumber';
import { DateFormat } from '@/util/dateFormat';

const props = defineProps({
	selected: {
		type: Boolean,
		default: false
	},
	data: {
		type: Object,
		default: () => { }
	}
})

function getFirstLetter(name) {
	if (!name?.trim()) return ''

	return name.trim()[0].toUpperCase()
}

</script>
