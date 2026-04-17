<template>
	<ModalRight ref="refModalHistory" title="Historial" width="400">
		<div class="d-middle gap-x-4 mb-4">
			<p class="f-tm-14 me-auto">Última conversación</p>
			<p class="f-tm-14">{{ DateFormat(info.lastConnection, 'DD MMM YYYY HH:mm a') }}</p>
			<Button class="w-[36px] !p-0">
				<i class="icon-messages !text-lg" />
			</Button>
		</div>
		<el-scrollbar class="bg-blue-s-50" view-class="h-full p-4" style="height: calc(100vh - 200px);">
			<div class="vstack gap-y-3 pb-4">
				<div v-for="item in listChat" :key="item.id"
					class="flex">
					<cardChat :identify="item.type == 1"
						:message="item.content" class="w-[295px]" />
					<div v-if="item.type !== 1" class="d-middle-center rounded-full overflow-hidden relative bg-green-s-100 min-w-[24px] !size-[24px] ms-3">
						<img src="/img/generals/Body.svg" class="absolute -bottom-[4px] w-[17px]"/>
					</div>
				</div>
			</div>
		</el-scrollbar>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { DateFormat } from '@/util/dateFormat.js'
import { request } from "@request";
import cardChat from '@comp/CardChat.vue';

const refModalHistory = ref()

const info = ref({
	idChat: null,
	lastConnection: null
})

const listChat = ref([])

/* Functions */
async function open() {
	refModalHistory.value.open()
}

defineExpose({
	open,
})
</script>