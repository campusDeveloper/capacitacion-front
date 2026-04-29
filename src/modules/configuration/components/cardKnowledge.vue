<template>
	<div :class="['rounded-lg py-2 px-4 w-[267px] h-[84px] transition-all duration-300 ease-out flex flex-col', !data.state ? 'hover:bg-[rgb(var(--xx-color-card-surface-inactive-hover))] hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),_0_4px_6px_-1px_rgba(0,0,0,0.1)] bg-[rgb(var(--xx-color-card-surface-inactive-rest))]': 'hover:!bg-[rgb(var(--xx-color-card-surface-active-hover))] hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),_0_4px_6px_-1px_rgba(0,0,0,0.1)] bg-[rgb(var(--xx-color-card-surface-active-rest))]']"
		style="box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
		<div class="flex items-start justify-between mb-2">
			<p class="f-tm-12 text-[rgb(var(--xx-color-text-black))]">{{ data.name }}</p>
            <div class="-mr-2">
                <div class="d-middle-center gap-1">
                    <el-tooltip content="Inactivo">
                        <i v-if="!data.state" class="icon-moon text-[rgb(var(--xx-color-blue-semantic-600))]"/>
                    </el-tooltip>
                    <el-switch v-model="data.state" size="small" :active-value="1" :inactive-value="0"
                        :before-change="openChangeState" />
                    <DropdownOptions :options="options" :params="data" size-icon="text-[rgb(var(--xx-color-text-primary))] text-[16px]" placement="right" size="size-[20px]"/>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between">
            <p class="f-t-11 text-primary max-w-[160px]">Fecha creación: {{ formatDateWithMayus(data.createdAt, 'D MMM YYYY') }}</p>
            <i class="icon-eye-fill text-[rgb(var(--xx-color-icons-primary))] cursor-pointer -mr-[9.4px]" @click="openDocument"/>
        </div>
	</div>
    <ModalPDF ref="refModalPDF"/>
</template>

<script setup>
import { ref } from 'vue';
import { DateFormat } from '@/util/dateFormat.js'

const refModalPDF = ref();

const emit = defineEmits(['onDelete', 'onChangeState']);

const props = defineProps({
	data: {
		default: {}
	}
})

const options = [
    { option: 'Eliminar', action: openDelete, icon: 'icon-trash', danger: true },
]

function formatDateWithMayus(date, format = 'DD MMM YYYY') {
    const formattedDate = DateFormat(date, format);

    return formattedDate.replace(
        /\b([a-záéíóúñ])/,
        (match) => match.toUpperCase()
    );
}

function openDocument() {
    if (!props.data?.file) return;
    refModalPDF.value.open(props.data.file);
}

// Emitters
function openDelete() {
    emit('onDelete', props.data);
}

function openChangeState() {
    emit('onChangeState', props.data);
    return false
}
</script>
