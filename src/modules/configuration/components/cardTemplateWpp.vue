<template>
	<div
		:class="['d-middle gap-x-3 w-[390px] rounded-lg p-4 transition-all ease-linear duration-100 border border-[transparent] cursor-pointer shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),_0_1px_3px_0_rgba(0,0,0,0.1)]',
			data.state ? 'bg-white-50 hover:bg-white-300' : 'bg-light-gray-50 hover:bg-light-gray-100 hover:border-mid-gray-300']">
		<img v-if="data.imageUrl" :src="data.imageUrl" @error="(e) => { e.target.src = '/img/empty/messages-2.png' }"
			alt="" class="rounded-lg min-w-[40px] !size-[40px]">
		<div class="vstack gap-y-2 w-full">
			<div class="d-middle gap-x-2">
				<p class="text-mid-gray-600 f-tm-14 me-auto">Plantilla_{{ data.code }}</p>
				<el-switch v-model="data.state" size="small" :active-value="1" :inactive-value="0" @click.stop
					:before-change="() => handleChangeState(data)" />
				<DropdownOptions :options="options" :params="data" size-icon="!text-primary text-2xl"
					placement="right-start" />
			</div>
			<pre class="line-clamp-2 f-t-12">{{ data.description }}</pre>
			<div class="d-middle gap-x-2">
				<Tags
					:class="['!h-[20px] !rounded-lg', data.statusMeta == 1 ? '!text-green-s-700' : data.statusMeta == 2 ? '!text-red-s-600' : 'text-black-300']"
					:typeStyle="data.statusMeta == 1 ? 'success' : data.statusMeta == 2 ? 'danger' : 'disabled'"
					size="xsmall">
					<div v-if="[1, 2].includes(data.statusMeta)" class="d-middle-center size-[16px]">
						<i
							:class="['text-sm', data.statusMeta == 1 ? 'icon-check' : data.statusMeta == 2 ? 'icon-close' : '']" />
					</div>
					<p>{{ data.statusMeta == 1 ? 'Aprobado' : data.statusMeta == 2 ? 'Rechazado' : 'En revisión' }}</p>
				</Tags>
				<p class="text-mid-gray-200 f-t-12">{{ DateFormat(data.createdAt, 'DD MMM YYYY') }}</p>
				<div v-if="data.buttonType != null" class="d-middle text-blue-s-700 ms-auto">
					<i class="icon-mouse-fill text-brand-300" />
					<p class="f-t-12">
						Botón {{ data.buttonType === 1 ? '#Tel' : 'URL' }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Tags from '@comp/Tags.vue'
import { DateFormat } from '@/util/dateFormat.js'

//-Constantes

const props = defineProps({
	data: {
		default: {}
	}
})

const options = [
	{ option: 'Eliminar', action: openDelete, icon: 'icon-trash', danger: true },
]

const emit = defineEmits(['handleChangeState', 'openDelete']);

/* Functions */
function handleChangeState(data) {
	emit('handleChangeState', data)
	return false
}

function openDelete() {
	emit('openDelete', props.data)
}

</script>