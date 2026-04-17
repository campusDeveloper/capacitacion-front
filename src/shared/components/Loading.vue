<template>
    <div v-if="showLoading" class="d-middle-center w-full h-full">
        <Vue3Lottie :animation-data="animation" :loop="loop" :height="height" />
    </div>
</template>

<script setup>
import { Vue3Lottie } from 'vue3-lottie';
import loading from '../../assets/animation/loading-check.json';

const props = defineProps({
    animation: {
        type: Object,
        default: loading
    },
    showLoading: {
        type: Boolean,
        default: true
    },
	height: {
		type: String,
		default: '272px',
		required: false
	},
	loop: {
		type: Boolean,
		default: true,
		required: false
	}
})

</script>