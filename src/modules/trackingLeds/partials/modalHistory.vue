<template>
	<ModalRight ref="refModalHistory" title="Historial" width="400" @close="handleClose">
		<div class="d-middle gap-x-4 mb-4">
			<p class="f-tm-14 me-auto">Ultima conversacion</p>
			<p class="f-tm-14">{{ formatLastConnection(props.lastConnection) }}</p>
			<Button class="w-[36px] !p-0" @click="toGoChats">
				<i class="icon-messages !text-lg" />
			</Button>
		</div>
		<el-scrollbar v-loading="props.loadingMessagesHistory" class="bg-blue-s-50" view-class="h-full p-4" style="height: calc(100vh - 200px);">
			<div v-if="props.messagesHistoryError" class="d-middle-center h-full px-4 text-center">
				<p class="f-t-14 text-mid-gray-600">{{ props.messagesHistoryError }}</p>
			</div>
			<div v-else-if="!props.loadingMessagesHistory && !props.messagesHistory.length" class="d-middle-center h-full px-4 text-center">
				<p class="f-t-14 text-mid-gray-600">No hay mensajes</p>
			</div>
			<div v-else class="vstack gap-y-3 pb-4">
				<div v-for="message in props.messagesHistory" :key="message.id" :class="['flex', message.type !== 1 ? 'justify-end' : '']">
					<div v-if="message.type !== 1" :class="['d-middle-center rounded-full overflow-hidden relative min-w-[24px] !size-[24px] me-3', messageTypeMeta(message.type).avatarClass]">
						<img src="/img/generals/Body.svg" class="absolute -bottom-[4px] w-[17px]" />
					</div>
					<div>
						<p class="f-tm-12 text-mid-gray-600 pb-1">{{ messageTypeMeta(message.type).name }}</p>
						<cardChat
							:identify="message.type == 1"
							:message="message.content"
							class="w-[262px]"
							classPre="f-t-12"
						/>
					</div>
				</div>
			</div>
		</el-scrollbar>
	</ModalRight>
</template>

<script setup>
import { ref, watch } from 'vue'
import { DateFormat } from '@/util/dateFormat.js'
import cardChat from '@comp/CardChat.vue'

const refModalHistory = ref()
const emit = defineEmits(['close'])
const props = defineProps({
	loadingMessagesHistory: {
		type: Boolean,
		default: false
	},
	messagesHistory: {
		type: Array,
		default: () => []
	},
	messagesHistoryError: {
		type: String,
		default: ''
	},
	lastConnection: {
		default: null
	}
})

watch(
	() => props.messagesHistory,
	(value) => {
		console.log('modalHistory props', value)
	},
	{ immediate: true, deep: true }
)

const MESSAGE_TYPE_META = {
	1: {
		name: 'Usuario',
		avatarClass: 'bg-white-50'
	},
	2: {
		name: 'Admin',
		avatarClass: 'bg-green-s-100'
	},
	3: {
		name: 'IA',
		avatarClass: 'bg-blue-s-100'
	},
}

function toGoChats() {
}

function messageTypeMeta(type) {
	return MESSAGE_TYPE_META[Number(type)] ?? MESSAGE_TYPE_META[1]
}

function formatLastConnection(value) {
	return value ? DateFormat(value, 'DD MMM YYYY HH:mm a') : '--'
}

function handleClose() {
	emit('close')
}

function open() {
	refModalHistory.value.open()
}

defineExpose({
	open,
})
</script>
