<template>
    <router-link v-if="isRedirect"
        :to="{ name: `${data.route}`, params: data.params }"
        :class="['route-father d-middle rounded cursor-pointer gap-x-2 px-3', classModule]"
    >
        <div class="content-icon d-middle me-auto w-10 gap-x-2">
            <slot />
            <p class="first-letter:uppercase max-w-[9.375rem] min-w-[9.375rem] f-tm-14 !line-clamp-1">{{ data.name }}</p>
        </div>
		<optBadge v-if="data.count || some(data.children, 'count')"
			:number="data?.count"
			size="small" :class="['badge-number', { 'w-fit with-number': !some(data.children, 'count') }]"
		/>
        <div class="d-middle-center children-icon gap-x-2 h-[1.5rem]">
            <i v-if="data.children" class="icon-chevron-right icon-rotate ease-linear duration-100" />
        </div>
    </router-link>
    <div v-else
        class="route-father div-childrens d-middle cursor-pointer gap-x-2 px-3"
        :class="classModule"
    >
        <div class="content-icon d-middle me-auto w-10 gap-x-2">
            <slot />
            <p class="first-letter:uppercase max-w-[9.375rem] min-w-[9.375rem] f-tm-14 !line-clamp-1">{{ data.name }}</p>
        </div>
		<optBadge v-if="data.count || some(data.children, 'count')"
			:number="data?.count"
			size="small" :class="['badge-number', { 'w-fit with-number': !some(data.children, 'count') }]"
		/>
        <div class="d-middle-center children-icon gap-x-2 h-[1.5rem]">
            <i v-if="data.children" class="icon-chevron-right icon-rotate ease-linear duration-100" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import optBadge from './optBadge.vue';
import { some } from 'lodash';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    isRedirect: {
        type: Boolean,
        default: true
    },
    classModule: {
        type: String,
        default: ''
    },
})

</script>