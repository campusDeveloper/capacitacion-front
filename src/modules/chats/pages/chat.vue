<template>
	<section class="vstack overflow-hidden w-full h-full gap-y-[1px]">
		<Navbar name="Chats" />
		<div class="flex w-full h-full overflow-hidden">
			<el-scrollbar class="!bg-white-200 min-w-[424px] max-w-[424px] shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.1),_0px_4px_6px_-1px_rgba(0,0,0,0.1)]"
				view-class="h-full me-[3px] px-3">
				<div class="vstack pb-4 gap-y-4">
					<div class="vstack gap-y-3 pt-4 !bg-white-200 sticky top-0" style="z-index: 4;">
						<div class="d-middle gap-x-4 pb-4">
							<el-input :disabled="loading" v-model="filter.search" placeholder="Buscar" class="relative !w-full">
								<template #suffix>
									<Button :disabled="loading" type-style="tertiary" class="absolute right-0 !rounded-lg !p-0"
										@click="handleFilter">
										<i class="icon-search !text-xl" />
									</Button>
								</template>
							</el-input>
							<el-tooltip content="Filtros">
								<Button :disabled="loading" class="!p-0" @click="openFilters">
									<i class="icon-setting-3 !text-xl" />
								</Button>
							</el-tooltip>
						</div>
						<Button v-if="unread" :disabled="loading" type-style="tertiary" size="small" class="d-middle-center !w-[126px] !px-0"
							@click="filterChatdUnread(true)">
							No leídos <span>({{ unread }})</span>
							<i v-if="notReadFilter" class="icon-close" @click.stop="filterChatdUnread(false)" />
						</Button>
					</div>
					<transition name="fade">
						<div v-if="loading" class="text-center">
							<span class="text-gray-500 text-sm">Cargando chats...</span>
						</div>
					</transition>

					<div
						v-if="true"
						:class="['vstack rounded-lg gap-y-4 border border-[transparent]', { 'bg-brand-50 p-3': notReadFilter }]"
					>
						<cardChat v-for="item in 5" :key="item.idOpportunity" :data="item"
							:selected="route.params.idChat == item.idOpportunity" @click="toGoChatDetail(item)" />
					</div>
					<div v-else-if="!loading" class="text-center">
						<span class="text-gray-500 text-sm">No hay chats disponibles</span>
					</div>
				</div>
			</el-scrollbar>
			<div v-if="route.name == 'chats'" class="vstack items-center justify-center w-full h-full">
				<img src="/img/illustrations/chatbot.svg" alt="" class="size-[198px]">
				<p class="text-mid-gray-600 f-ts-18">Sin selección</p>
				<p class="f-tm-12">Selecciona un chat para ver más detalles</p>
			</div>
			<router-view />
		</div>
		<modalFilters ref="refModalFilters" :filter="filter" @filterChats="handleFilter" />
	</section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { request } from "@request";
import cardChat from '../components/cardChat.vue';
import modalFilters from '../partials/modalFilters.vue';

const route = useRoute()
const router = useRouter()

const refModalFilters = ref()

const loading = ref(false)

const allChats = ref([])
const unread = ref(0)
const notReadFilter = ref(false)
const chatsFiltered = ref([])

const filter = ref({
	search: '',
	idHeadquarter: null,
	idException: null,
	idTracking: null
})

/* Async Functions  */

async function handleFilter() {
	
	router.push({ name: 'chats' })
}

function filterChatdUnread() {
	
}


/* Functions */ 
function openFilters() {
	refModalFilters.value.open()
}

function toGoChatDetail(selected) {
	router.push({ name: 'chat.details', params: { idChat: 1 } })
	
}

</script>