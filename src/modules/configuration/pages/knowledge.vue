<template>
    <Navbar name="Conocimiento" :actionBack="goBack" />
    <section class="flex flex-col w-full pt-8 pr-9 pb-11 pl-7 gap-8 gap-y-10">
        <cardHeardquarter v-if="generalHeadQuarter" :data="generalHeadQuarter" :key="generalHeadQuarter.idHeadquarter" :disabled="loading" :isGeneral="true"/>
        <div class="d-middle gap-7 w-full flex-wrap">
            <cardHeardquarter v-for="headquarter in headquarters" :key="headquarter.idHeadquarter" :data="headquarter"/>
        </div>
    </section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import cardHeardquarter from '../components/cardHeardquarter.vue';
import { useRouter } from 'vue-router';
import { request } from "@request"
import { getHeadquarters } from '../services/knowledgeService';

const router = useRouter();

const loading = ref(false)

const generalHeadQuarter = ref(undefined)
const headquarters = ref([])


// Functions
function goBack() {
    router.push({ name: 'configuration.main' })
}

async function loadHeadquarters() {
    loading.value = true
    const { data, error } = await request(() => getHeadquarters(), { success: false, error: true })
    loading.value = false
    if (error) return

    const rows = Array.isArray(data?.data) ? data.data : []
    generalHeadQuarter.value = rows.find((row) => row.idHeadquarter === null)
    headquarters.value = rows.filter((row) => row.idHeadquarter !== null)
}

onBeforeMount(loadHeadquarters)
</script>
