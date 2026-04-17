<template>
    <div
        class="d-middle-bt pt-5 pr-1 pb-6 pl-6 w-[395.3px] h-[188px] rounded-lg transition-all duration-300 ease-out shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]"
        :class="cardClasses">
        <div class="flex flex-col gap-2 w-full" :class="isActive && 'text-white-100'">
            <div class="d-middle-bt">
                <h1 class="f-tm-14" :class="titleClasses">{{ agentConfig.name }}</h1>
                <div class="ms-auto mb-auto d-middle gap-1">
                    <div v-if="isActive" class="w-[50px] h-[22px] bg-green-s-100 rounded-lg d-middle-center">
                        <p class="f-t-12 !text-black-300">Activa</p>
                    </div>
                    <el-switch 
                        v-else 
                        :model-value="agentConfig.state"
                        :active-value="1"
                        :inactive-value="0"
                        size="small"
                        @update:model-value="handleToggleState"
                    />
                    <DropdownOptions
                        :options="optionsDropdown"
                        divClass="hover:!bg-transparent"
                        size="size-[30px] hover:!bg-transparent"
                        :icon="`icon-more-vert ${isActive ? '!text-white-100' : '!text-mid-gray-300'}`"
                    />
                </div>
            </div>

            <p class="f-t-12 line-clamp-2 max-w-[300px]">{{ agentConfig.description }}</p>

            <div class="flex flex-col gap-1 mt-2">
                <p
                    v-for="item in infoItems"
                    :key="item.label"
                    class="flex gap-2.5"
                    :class="labelClasses">
                    {{ item.label }}
                    <span :class="valueClasses">{{ item.value }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    agentConfig: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['openDelete', 'openEdit', 'openActive']);

const isActive = computed(() => props.agentConfig.state === 1);

const cardClasses = computed(() =>
    isActive.value
        ? 'bg-blue-s-600 hover:bg-blue-s-700'
        : 'bg-white-50 hover:bg-white-300'
);

const titleClasses = computed(() =>
    isActive.value
        ? 'text-white-100'
        : 'text-mid-gray-600'
);

const labelClasses = computed(() =>
    isActive.value
        ? 'text-white-400 f-tm-12'
        : 'text-mid-gray-600 f-tm-12'
);

const valueClasses = computed(() =>
    isActive.value
        ? 'text-white-400 f-t-12'
        : 'text-black-300 f-t-12'
);

const infoItems = computed(() => [
    { label: 'Embedding', value: props.agentConfig.embedding },
    { label: 'LLM', value: props.agentConfig.LLM },
    { label: 'Prompt', value: props.agentConfig.prompt }
]);

const optionsDropdown = computed(() => [
    { option: 'Editar', action: () => emit('openEdit', props.agentConfig), icon: 'icon-edit-2' },
    ...(isActive.value ? [] : [{ 
        option: 'Eliminar', 
        action: () => emit('openDelete', props.agentConfig), 
        icon: 'icon-trash', 
        danger: true 
    }]),
]);

function handleToggleState(newValue) {
    if (newValue === 1) {
        emit('openActive', props.agentConfig);
    }
}
</script>