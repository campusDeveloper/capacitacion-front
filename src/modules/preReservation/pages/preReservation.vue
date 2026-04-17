<template>
	<section class="vstack overflow-hidden h-full">
		<Navbar name="Pre-reservas" />
		<el-scrollbar view-class="p-6">
			<div class="tabs-link-bottom">
				<p :class="['each-menu', { 'selected': view == 1 }]" @click="view = 1">Activas</p>
				<p :class="['each-menu', { 'selected': view == 2 }]" @click="view = 2">Vencidas</p>
			</div>
			<div :class="['d-middle bg-brand-50 rounded-lg gap-x-4 p-3 my-5', view == 1 ? 'max-w-[1218px]': 'max-w-[1126px]']">
				<img :src="`/img/illustrations/${ view == 1 ? 'calendar': 'cancelled' }.svg`" alt="">
				<p class="f-t-12">{{ view == 1 ? 'Esta sección muestra las pre-reservas que se encuentran vigentes y pendientes de confirmación. Permite hacer seguimiento al estado de cada solicitud, los plazos de pago y las acciones necesarias para completar la reserva.': 'Esta sección agrupa las reservas que fueron cerradas automáticamente debido al incumplimiento del pago dentro del plazo establecido. Facilita la trazabilidad de los intentos de reserva y el análisis de oportunidades no concretadas.' }}</p>
			</div>
			<div :class="['d-middle-bt mb-5', view == 1 ? 'max-w-[1425px]': 'max-w-[1350px]']">
				<p class="text-mid-gray-600 f-tm-16">Lista de pre-reservas</p>
				<el-input :disabled="loading" v-model="search" placeholder="Buscar" class="relative !w-[250px]">
					<template #suffix>
						<Button :disabled="loading" type-style="tertiary" class="absolute right-0 !rounded-lg !p-0" >
							<i class="icon-search !text-xl"/>
						</Button>
					</template>
				</el-input>
			</div>
			<viewTableActive v-if="view == 1" :data="preservationActive" @openHistory="openHistory" />
			<viewTableExpired v-else :data="preservationExpired" @openHistory="openHistory" />
			<el-pagination v-if="view == 2 && pEPagination" class="!w-fit" :disabled="loading"
				:total="pEPagination.total" :page-count="pEPagination.totalPages"
				:hide-on-single-page="pEPagination.totalPages === 1"
				:page-size="pEPagination.limit" :current-page="pEPagination.currentPage"
				@current-change="hadlePagination" @prev-click="hadlePagination" @next-click="hadlePagination"
			/>
		</el-scrollbar>
		<modalHistory ref="refModalHistory" />
	</section>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { request } from "@request";
import viewTableActive from '../partials/viewTableActive.vue'
import viewTableExpired from '../partials/viewTableExpired.vue'
import modalHistory from '../partials/modalHistory.vue'

const refModalHistory = ref()

const view = ref(1);
const search = ref('')

const loading = ref(false)
const preservationActive = ref([

])

const preservationExpired = ref([])
const pEPagination = ref(null)
const pECurrent = ref(1)


/* Functions */
function openHistory(row) {
	if (!row) return
	refModalHistory.value.open()
}

</script>