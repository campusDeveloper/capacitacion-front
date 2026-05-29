<template>
	<div class="flex w-full bg-blue-50">
		<div class="vstack w-full min-w-[574px]">
			<div
				class="d-middle-bt w-full bg-white-200 min-h-[58px] shadow-[0px_1px_2px_0px_rgba(191,191,191,0.5)] px-5">
				<p class="f-tm-16">Detalle del chat</p>
				<div v-if="chatDetails" class="d-middle gap-x-2 f-t-12">
					<div v-if="chatDetails.exception"
						class="d-middle rounded-lg bg-red-s-50 px-2 text-red-s-600 h-[26px] me-2">
						<i class="icon-info-circle text-lg" />
						<p class="f-t-12">{{ chatDetails.exception }}</p>
					</div>
					<p>Admin</p>
					<el-switch :disabled="isLoadingMore" v-model="chatDetails.mode" :active-value="1" :inactive-value="2"
						size="small" :before-change="() => handleChangeSwitch(chatDetails.mode)" />
					<p>Agente IA</p>
				</div>
			</div>
			<el-scrollbar ref="scrollbarRef" view-class="vstack p-4 h-full">
				<div class="vstack gap-y-3">
					<div ref="loadTriggerRef" class="h-1" />
					<transition name="fade">
						<div v-if="isLoadingMore" class="text-center py-2">
							<span class="text-gray-500 text-sm">Cargando mensajes anteriores...</span>
						</div>
					</transition>

					<div v-for="item in messages" :key="item.idChatMessage" class="d-middle">
						<chatMessage :identify="item.type" :type="item.type" :message="item.content"
							class="max-w-[436px]" />
						<div v-if="item.type !== 1"
							:class="['d-middle-center rounded-full overflow-hidden relative min-w-[24px] !size-[24px] ms-3', item.type === 3 ? 'bg-green-100' : 'bg-brand-50']">
							<img v-if="item.type === 3" src="/img/generals/Body.svg"
								class="absolute -bottom-[4px] w-[17px]" />
							<i v-else class="icon-user text-xs text-brand-500" />
						</div>
					</div>
				</div>
			</el-scrollbar>
			<div v-if="chatDetails?.mode === 1"
				class="d-middle-center min-h-[45px] rounded-xl bg-dark-gray-50 mx-4 mb-4 mt-2">
				<p class="f-t-14 text-mid-gray-600">No puedes enviar mensajes cuando el agente IA esta activo</p>
			</div>
			<TextField v-else v-model="writeMessage" placeholder="Escribe un mensaje"
				:autosize="{ minRows: 2, maxRows: 2 }" @sendMessage="sendMessage" class="mx-4 mb-4 mt-2"
				:maxlength="255" />
		</div>
		<viewDetailClient v-if="chatDetails" :info="chatDetails" @refresh="loadLeadInformation" />
	</div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { request } from "@request";
import TextField from '@comp/TextField.vue';
import chatMessage from '../components/chatMessage.vue'
import viewDetailClient from '../partials/viewDetailClient.vue'
import {
	getLeadInformation,
	getLeadMessages,
	sendLeadMessage,
	toggleLeadMode,
} from '../services/chatService';

const scrollbarRef = ref(null)

const route = useRoute()
const idOpportunity = computed(() => Number(route.params.idChat))

const loadTriggerRef = ref(null)

const isLoadingMore = ref(false)
const chatDetails = ref(null)
const messages = ref([])
const pagination = ref(null)

const writeMessage = ref('')

const scrollToBottom = () => {
	nextTick(() => {
		setTimeout(() => {
			if (scrollbarRef.value?.wrapRef) {
				scrollbarRef.value.wrapRef.scrollTop = scrollbarRef.value.wrapRef.scrollHeight
			}
		}, 50)
	})
}

onMounted(loadChat)

async function handleChangeSwitch(value) {
	if (isLoadingMore.value) return

	isLoadingMore.value = true
	const { data, error } = await request(() => toggleLeadMode(idOpportunity.value), true)

	if (!error) {
		chatDetails.value.mode = data?.data?.mode ?? (value === 1 ? 2 : 1)
	}

	isLoadingMore.value = false
}

async function sendMessage(message) {
	const content = (message ?? writeMessage.value).trim()
	if (!content) return

	const { data, error } = await request(() => sendLeadMessage(idOpportunity.value, content), true)

	if (!error) {
		messages.value.push(data?.data ?? {
			idChatMessage: Date.now(),
			type: 2,
			content,
		})
		scrollToBottom()
	}
}

async function loadChat() {
	if (!idOpportunity.value) return

	await Promise.all([loadLeadInformation(), loadMessages()])
	scrollToBottom()
}

async function loadLeadInformation() {
	const { data, error } = await request(() => getLeadInformation(idOpportunity.value), { success: false })
	if (!error) chatDetails.value = data?.data
}

async function loadMessages(page = 1) {
	isLoadingMore.value = true
	const { data, error } = await request(() => getLeadMessages(idOpportunity.value, page), { success: false })

	if (!error) {
		pagination.value = data?.data ?? null
		messages.value = [...(pagination.value?.data ?? [])].reverse()
	}

	isLoadingMore.value = false
}

watch(() => route.params.idChat, loadChat)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
