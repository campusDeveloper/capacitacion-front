<template>
    <Modal
    ref="modalForm"
	class="modal-form"
    :title="title"
    :width="width"
	:destroy-on-close="destroyOnClose"
	:bigTitle="bigTitle"
	:footer="footer"
    >
		<template #body>
			<Form ref="form" v-slot="{ resetForm, values }" :initial-values="initialValues" @submit="onSubmit">
				<div class="overflow-auto px-[1.5rem] py-[1rem] f-b2 bg-[rgb(var(--xx-color-modal-surface))] text-[rgb(var(--xx-color-text-primary))]" :style="{ maxHeight: `calc(100vh - ${ isColumn ? '350': '250' }px)` }">
					<slot :values="values" />
				</div>
				<slot name="footer" :resetForm="resetForm" :close="close" :action="action" :loading="loading">
					<template v-if="btnCancel || btnConfirm">
						<div class="flex modal-footer justify-end gap-x-2 gap-y-4 p-[1rem]">
							<slot name="footer">
								<Button v-if="btnCancel" type="reset" type-style="secondary" :size="sizeBtn" @click="close(resetForm)" class="!min-w-[100px]"> {{ cancel }} </Button>
								<Button
									v-if="btnConfirm && onAction"
									type="submit"
									:disabled="disabledConfirm"
									:type-style="btnActionType"
									:size="sizeBtn"
									class="!min-w-[100px]"
								>
									<!-- <Spinner :loading="loading"/> -->
									{{ action }}
								</Button>
							</slot>
						</div>
					</template>
				</slot>
			</Form>
		</template>
    </Modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Form } from 'vee-validate';
import { useErrors } from '../../store/errors.js';
import { storeToRefs } from 'pinia';

const props = defineProps({
	title: { type: String, default: '' },
	action: { type: String, default: 'Crear' },
	cancel: { type: String, required: false, default: 'Cerrar', },
	bigTitle: { type: Boolean, default: false },
	width: { type: String, default: '30%' },
	autoClose: { type: Boolean, default: false },
	btnConfirm: { type: Boolean, default: true },
	btnCancel: { type: Boolean, default: true },
	btnActionType: { type: String, default: 'primary' },
	sizeBtn: { type: String, default: 'medium' },
	destroyOnClose: { type: Boolean, default: false },
	footer: { type: Boolean, default: false },
	disabledConfirm: { type: Boolean, default: false },
	initialValues: { type: Object, default: () => {} },
	onAction: { type: Function, default: () => {} },
	onSuccess: { type: Function, default: () => {} },
	onError: { type: Function, default: () => {} },
})

const { hasErrors } = storeToRefs(useErrors());
const modalForm = ref();
const loading = ref(false);
const form = ref();
const emit = defineEmits(['close'])

const isColumn = computed(() => {
	let modalWidth = props.width
	if(props.width.trim().endsWith('%')){
		modalWidth = (props.width.replace('%', '') * innerWidth) / 100;
	}
	return modalWidth <= 419
})

function close(resetForm = null) {
	modalForm.value.close();
	if(typeof resetForm === 'function') resetForm();
	emit('close');
}

function open() {
	loading.value = false;
	modalForm.value.open();
}

async function onSubmit(_, { resetForm }){
	loading.value = true;
	await props.onAction();
	if (!hasErrors.value) {
		props.onSuccess();
		if(props.autoClose) close();
		setTimeout(() => resetForm(), 500);
	} else {
		await props.onError();
	}
	loading.value = false;
}

defineExpose({
	close,
	open,
});

</script>
<style lang="scss">
</style>
