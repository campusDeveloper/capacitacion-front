<template>
	<div class="flex bg-white-100 rounded-xl p-4 gap-x-5">
		<slot name="photo">
			<div v-if="info.foto" class="relative rounded-full min-w-12 size-12">
				<img :src="info.foto" alt="" class="!size-12">
				<i class="icon-moon text-lg text-blue-s-500 absolute -top-4 -right-3"/>
			</div>
		</slot>
		<div class="vstack custom-comment gap-y-1">
			<p :class="['text-mid-gray-600', className]">{{ info.creator?.name ?? "-" }}</p>
			<p :class="['text-mid-gray-200 ', classDown]">{{ DateFormat(info.createdAt, 'DD MMM YYYY HH:mm a') }}</p>
			<pre :class="['text-black-300 f-t-12', classDown]">{{ info.comment }}</pre>
		</div>
	</div>
</template>

<script setup>
import { DateFormat } from '@/util/dateFormat.js';

const props = defineProps({
	info: {
		type: Object,
		default: {
			foto: '/img/trash/foto-profile-men.png',
			nombre: 'Luis Alberto Ramirez',
			fecha: new Date(),
			comentario: 'El item bajó de precio por la inflación correspondiente a este año y por eso se hizo la respectiva modificación, ya no se consigue en Manizales ni en Villavicencio.'
		}
	},
	className: {
		type: String,
		default: 'f-tm-16'
	},
	classDown: {
		type: String,
		default: 'f-t-12'
	}
})

</script>
