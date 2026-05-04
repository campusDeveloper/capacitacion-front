<template>
	<div :class="['d-middle rounded-lg text-[rgb(var(--xx-color-text-light-black))] gap-5 p-6 w-[380px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),_0_4px_6px_-1px_rgba(0,0,0,0.1)] h-[154px] border hover:border-[rgb(var(--xx-color-border-dark-primary))] transition-all duration-300 ease-out', !data.state ? 'hover:bg-[rgb(var(--xx-color-card-surface-inactive-hover))] border-[rgb(var(--xx-color-card-surface-inactive-rest))] bg-[rgb(var(--xx-color-card-surface-inactive-rest))]' : 'hover:bg-[rgb(var(--xx-color-card-surface-active-hover))] border-[rgb(var(--xx-color-card-surface-active-rest))] bg-[rgb(var(--xx-color-card-surface-active-rest))]']">
        <i v-if="isGeneral" class="icon-buildings-2 text-[40px] -ml-3 text-[rgb(var(--xx-color-icons-primary))]"/>
        <img v-else src="/img/trash/building-3.png" alt="">
        <div class="w-[276px] flex flex-col gap-3 cursor-pointer" @click="goToDetail">
            <p class="f-ts-16">{{ data.name }}</p>
            <span class="d-middle f-t-14">
                <i class="icon-category text-[rgb(var(--xx-color-icons-primary))] text-[16px] -ml-1"/>
                <p>{{ data.categories }} Categorías</p>
            </span>
            <span class="d-middle f-t-14">
                <i class="icon-document-text text-[rgb(var(--xx-color-icons-primary))] text-[16px] -ml-1"/>
                <p>{{ data.docs }} Conocimientos</p>
            </span>
        </div>
        <el-switch v-if="!isGeneral" :disabled="loading" v-model="data.state" :active-value="1" :inactive-value="0" class="mb-auto mt-2" size="small" :before-change="handleChangeState"/>
        <Modal ref="refModalActive" title="Activar Sede" action="Activar" cancel="Cancelar" width="362" :on-action="() => updateHeadquarterStateById(true)">
            <p>¿Deseas activar esta sede? <br/>Al hacerlo, se habilitarán sus funciones en todo el sistema</p>
        </Modal>
        <Modal ref="refModalInactive" title="Inactivar Sede" action="Inactivar" type="danger" woIcon cancel="Cancelar" width="362" :on-action="updateHeadquarterStateById">
            <p>¿Deseas inactivar esta sede? <br/>Al hacerlo, se inhabilitarán sus funciones en todo el sistema</p>
        </Modal>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from "@request"
import { changeHeadquarterStateById } from '../services/knowledgeService';

const loading = ref(false)

const refModalActive = ref();
const refModalInactive = ref();

const router = useRouter();

const props = defineProps({
	data: {
		required: true
	},
    isGeneral: {
        default: false
    }
})

function handleChangeState() {
    if (props.data.state === 1) {
        openInactive()
    } else {
        openActive()
    }
    return false
}

function openActive() {
    refModalActive.value.open();
}

function openInactive() {
    refModalInactive.value.open();
}

async function updateHeadquarterStateById() {
    loading.value = true
    const { error } = await request(() => changeHeadquarterStateById(props.data.idHeadquarter), true)
    loading.value = false
    if (error) return false

    props.data.state = props.data.state === 1 ? 0 : 1
    refModalActive.value.close()
    refModalInactive.value.close()
    return true
}

function goToDetail() {
    const id = props.isGeneral ? 'general' : props.data.idHeadquarter
    router.push({ name: 'configuration.knowledge', params: { id } })
}

</script>
