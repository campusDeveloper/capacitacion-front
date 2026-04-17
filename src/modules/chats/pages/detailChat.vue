<template>
	<div  class="flex w-full bg-blue-50">
		<div class="vstack w-full min-w-[574px]">
			<div
				class="d-middle-bt w-full bg-white-200 min-h-[58px] shadow-[0px_1px_2px_0px_rgba(191,191,191,0.5)] px-5">
				<p class="f-tm-16">Detalle del chat</p>
				<div class="d-middle gap-x-2 f-t-12">
					<div v-if="chatDetails.exception"
						class="d-middle rounded-lg bg-red-s-50 px-2 text-red-s-600 h-[26px] me-2">
						<i class="icon-info-circle text-lg" />
						<p class="f-t-12">{{ chatDetails.exception }}</p>
					</div>
					<p>Admin</p>
					<el-switch :disabled="isLoadingMore" v-model="chatDetails.mode" :active-value="1" :inactive-value="2" size="small"
						:before-change="() => handleChangeSwitch(chatDetails.mode)" />
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
			<div v-if="chatDetails.mode === 1"
				class="d-middle-center min-h-[45px] rounded-xl bg-dark-gray-50 mx-4 mb-4 mt-2">
				<p class="f-t-14 text-mid-gray-600">No puedes enviar mensajes cuando el agente
					IA está activo</p>
			</div>
			<TextField v-else v-model="writeMessage" placeholder="Escribe un mensaje"
				:autosize="{ minRows: 2, maxRows: 2 }" @sendMessage="sendMessage" class="mx-4 mb-4 mt-2"
				:maxlength="255" />
		</div>
		<viewDetailClient v-if="chatDetails" :info="chatDetails" />
	</div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { request } from "@request";
import TextField from '@comp/TextField.vue';
import chatMessage from '../components/chatMessage.vue'
import viewDetailClient from '../partials/viewDetailClient.vue'

const scrollbarRef = ref(null)

const route = useRoute()

const idOpportunity = 1

const loadTriggerRef = ref(null)

const isLoadingMore = ref(false)
const chatDetails = ref(
	{
		idChat: 1,
		mode: 1,
		exception: null
	}
)
const messages = ref([
	{
		idChatMessage: 1,
		type: 1,
		content: "Hola, ¿en qué puedo ayudarte?"
	},
	{
		idChatMessage: 2,
		type: 2,
		content: "Hola, tengo una pregunta sobre mi pedido."
	},
	{
		idChatMessage: 3,
		type: 1,
		content: "Claro, ¿cuál es tu número de pedido?"
	}
])
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

onMounted(() => {
	setTimeout(scrollToBottom, 300)

})


async function handleChangeSwitch(value) {
	if (isLoadingMore.value) return

	const finalMode = value === 1 ? 2 : 1

	try {
		isLoadingMore.value = true

		chatDetails.value.mode = finalMode
	} catch (error) {
		console.error("Error:", error);
	} finally {
		isLoadingMore.value = false
	}
}

async function sendMessage() {
	if (!writeMessage.value) return
}
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