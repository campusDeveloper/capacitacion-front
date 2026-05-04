<template>
	<el-drawer v-model="dialogVisible" direction="rtl" :size="width" :show-close="showClose" @close="closeDrawer" :destroy-on-close="destroyOnClose">
		<template #header>
			<div class="d-middle-bt ps-3.5 pe-4 text-[rgb(var(--xx-color-text-primary))]">
				<h4 class="textf-ts-20 mb-0">{{ title }}</h4>
                <i class="icon-close !text-xl text-[rgb(var(--xx-color-icons-primary))]" @click="close"></i>
			</div>
		</template>
		<template #default>
            <div class="text-[rgb(var(--xx-color-text-primary))]">
                <slot></slot>
            </div>
		</template>
		<template v-if="!woFooter" #footer>
			<slot name="footer">
				<slot name="buttons"></slot>
			</slot>
		</template>
	</el-drawer>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	showClose:{
		type: Boolean,
		default: false,
		required: false
	},
	width: {
		type: String,
		default: '30%',
		required: false
	},
	destroyOnClose: {
		type: Boolean,
		default: false
	},
	woFooter: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['close', 'closeDrawer'])

const dialogVisible = ref(false);

function open() {
	dialogVisible.value = true;
}
function close(resetForm) {
	dialogVisible.value = false;
}

function closeDrawer(){
	emit('close')
	emit('closeDrawer')
}

defineExpose({
	close,
	open,
});
</script>

<style lang="scss" scoped>
h4 {
    font-family: 'GoogleSansFlex-SemiBold' !important;
    font-weight: 700;
}
</style>
