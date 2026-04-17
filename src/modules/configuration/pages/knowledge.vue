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

const router = useRouter();

const loading = ref(false)

const generalHeadQuarter = ref(undefined)

const headquarters = ref([
    {
        idHeadquarter: 1,
        name: 'Sede Principal',
        categories: 5,
        docs: 20,
        state: 1
    },
    {
        idHeadquarter: 2,
        name: 'Sede Norte',
        categories: 3,
        docs: 10,
        state: 0
    },
])


// Functions
function goBack() {
    router.push({ name: 'configuration.main' })
}
</script>
