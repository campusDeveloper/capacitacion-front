<template>
	<el-dialog
		v-model="dialogVisible"
		center
		:width="width"
		:draggable="false"
		:custom-class="customClass"
		:destroy-on-close="destroyOnClose"
		:show-close="false"
		@close="emit('close')"
		:close-on-press-escape="closePressEscape"
		:close-on-click-modal="closeOnClickModal"
        class="!bg-[rgb(var(--xx-color-modal-surface))]"
	>
		<template v-if="title" #header>
			<div class="d-middle justify-between items-start modal-header min-h-[62px] px-[1.5rem] py-[1rem] mb-1 text-[rgb(var(--xx-color-text-primary))] !bg-[rgb(var(--xx-color-modal-surface))]">
				<div class="w-full text-start">
                    <div class="d-middle" :class="{ '-ml-2 gap-x-1': type === 'danger' && !woIcon }">
                        <i v-if="type === 'danger' && !woIcon" class="icon-info-circle text-[rgb(var(--xx-color-icons-dark-danger))] text-xl"/>
                        <p class="title f-ts-16 leading-[1]">{{ title }}</p>
                    </div>
					<p v-if="subTitle" class="sub-title text-start mt-1">{{ subTitle }}</p>
				</div>
				<slot name="header-right" />
				<i class="icon-close !text-xl text-[rgb(var(--xx-color-icons-primary))]" @click="onCancelClick" />
			</div>
		</template>
		<template #default>
			<slot name="body">
				<div class="vstack overflow-auto custom-scroll px-[1.5rem] py-[1rem] f-b2 !bg-[rgb(var(--xx-color-modal-surface))] text-[rgb(var(--xx-color-text-primary))]" style="max-height: calc(100vh - 290px);">
					<slot />
				</div>
			</slot>
		</template>
		<template v-if="footer" #footer>
			<div class="flex modal-footer justify-end gap-x-2 gap-y-4 p-[1rem]">
				<slot name="footer">
					<Button v-if="btnCancel" :type-style="btnCancelType" :size="sizeBtn" @click.prevent="onCancelClick" class="!min-w-[100px]"> {{ cancel }} </Button>
					<Button
						v-if="btnConfirm && onAction"
						:type-style="type === 'danger' ? 'danger' :btnActionType"
						:size="sizeBtn"
						:disabled="disableAction"
						class="!min-w-[100px]"
						@click.prevent="!loading ? confirm() : () => {}"
					>
						<!-- <Spinner :loading="loading"/> -->
						{{ action }}
					</Button>
				</slot>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
// import Spinner from '../Spinner.vue';

const emit = defineEmits(['update:modelValue', 'close', 'cancel']);

const props = defineProps({
    type: {
        type: String,
        required: false,
        default: 'default'
    },
	woIcon: {
		type: Boolean,
		required: false,
		default: false
	},
	title: {
		type: String,
		required: true,
		default: '',
	},
	subTitle: {
		type: String,
		required: false,
		default: '',
	},
	btnActionType: {
		type: String,
		default: 'primary',
	},
	btnCancelType: {
		type: String,
		default: 'secondary',
	},
	sizeBtn: {
		type: String,
		default: 'medium'
	},
	action: {
		type: String,
		required: false,
		default: 'Aceptar',
	},
	cancel: {
		type: String,
		required: false,
		default: 'Cerrar',
	},
	width: {
		type: String,
		required: false,
		default: '30%',
	},
	autoClose: {
		type: Boolean,
		required: false,
		default: false,
	},
	customClass: {
		type: String,
		required: false,
		default: '',
	},
	btnConfirm: {
		type: Boolean,
		required: false,
		default: true,
	},
	btnCancel: {
		type: Boolean,
		required: false,
		default: true,
	},
	onAction: {
		type: Function,
		required: false,
		default: () => {}
	},
	destroyOnClose: {
		type: Boolean,
		required: false,
		default: false
	},
	showClose: {
		type: Boolean,
		required: false,
		default: true
	},
	disableAction: {
		type: Boolean,
		required: false,
		default: false
	},
	footer:{
		type: Boolean,
		required: false,
		default: true
	},
	closePressEscape: {
		type: Boolean,
		default: true
	},
	closeOnClickModal: {
		type: Boolean,
		default: true
	},
})

const loading = ref(false);
const dialogVisible = ref(false);

watch(() => dialogVisible.value, (newValue) => {
	emit('update:modelValue', newValue);
});

function close() {
	dialogVisible.value = false;
}

function onCancelClick() {
	emit('cancel');
	close();
}

function open() {
	loading.value = false;
	dialogVisible.value = true;
}

async function confirm(){
	if(props.disableAction) return
	if(isPromise(props.onAction)){
		loading.value = true;
		if(props?.onAction){
			await props?.onAction();
			loading.value = false;
			if(props.autoClose) close();
		}
	}else{
		if(props?.onAction) props.onAction();
		if(props.autoClose) close();
	}
}

function isPromise(f) {
	return f && Object.prototype.toString.call(f) === '[object AsyncFunction]';
}

defineExpose({
	close,
	open,
});

</script>

<style lang="scss" scoped>
.title {
	font-family: 'GoogleSansFlex-SemiBold' !important;
	font-weight: 700;
}
.sub-title {
	font-family: 'GoogleSansFlex-Regular' !important;
	font-weight: 400;
	font-size: 0.75rem;
	line-height: 1.125rem;
}
</style>
