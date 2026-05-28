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
            
            <viewTableActive v-if="view == 1" :data="filteredPreservationActive" @openHistory="openHistory" />
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
import { onMounted, ref, computed } from 'vue';
// CAMBIO 1: Importamos también la función de las vencidas
import { getActivePreReservations, getExpiredPreReservations } from '../services/preReservationService.js';
import viewTableActive from '../partials/viewTableActive.vue';
import viewTableExpired from '../partials/viewTableExpired.vue';
import modalHistory from '../partials/modalHistory.vue';

const refModalHistory = ref();
const view = ref(1);
const search = ref('');
const loading = ref(false);

const rawPreservationActive = ref([]);

const filteredPreservationActive = computed(() => {
    if (!search.value) return rawPreservationActive.value;
    
    const searchTerm = search.value.toLowerCase();
    return rawPreservationActive.value.filter(item => 
        item.customer && item.customer.toLowerCase().includes(searchTerm)
    );
});

const preservationExpired = ref([]);
// CAMBIO 2: Inicializamos la paginación correctamente
const pEPagination = ref({ total: 0, totalPages: 1, currentPage: 1, limit: 10 });
const pECurrent = ref(1);

/* Funciones Activas */
const fetchActiveData = async () => {
    loading.value = true;
    try {
        const response = await getActivePreReservations();
        if (response?.data?.data) {
            rawPreservationActive.value = response.data.data;
        }
    } catch (error) {
        console.error("Error al obtener activas:", error);
    } finally {
        loading.value = false;
    }
};

/* CAMBIO 3: Creamos la función para traer las Vencidas */
const fetchExpiredData = async (page = 1) => {
    loading.value = true;
    try {
        const response = await getExpiredPreReservations(page, pEPagination.value.limit);
        
        if (response?.data?.data) {
            preservationExpired.value = response.data.data.data || []; 
            pEPagination.value = {
                total: response.data.data.total || 0,
                totalPages: response.data.data.totalPages || 1,
                currentPage: response.data.data.currentPage || 1,
                limit: response.data.data.limit || 10
            };
        }
    } catch (error) {
        console.error("Error al obtener vencidas:", error);
    } finally { 
        loading.value = false; 
    }
};

function openHistory(row) {
    if (!row) return;
    // TAREA 3: Le pasamos el idOpportunity al historial
    refModalHistory.value.open(row.idOpportunity);
}

// CAMBIO 4: Conectamos la paginación de la tabla
function hadlePagination(page) {
    pECurrent.value = page;
    fetchExpiredData(page);
}

onMounted(() => {
    fetchActiveData();
    // CAMBIO 5: Llamamos a las vencidas desde el inicio
    fetchExpiredData(1);
});
</script>