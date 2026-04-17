<template>
	<div class="vstack gap-y-2">
		<p class="text-mid-gray-600 f-ts-14">{{ title }}</p>
		<p class="f-t-14">{{ description }}</p>
        <p class="f-t-12">{{ subDescription }}</p>
		<div :class="['d-middle w-full h-[60px] border-dashed border-2 rounded-lg px-3 hover:bg-white-300', file ? 'border-green-s-400': 'border-blue-s-400']" @dragover.prevent @dragenter.prevent @drop="onDrop">
			<i class="icon-document-text text-[rgb(var(--xx-color-icons-dark-info))] text-lg" />
			<input ref="refFileInput" id="file-upload" type="file" @change="onFileChange" :accept="accept" hidden />
			<p class="f-t-12 px-2 !text-[rgb(var(--xx-color-text-primary))] me-auto"> {{ firstText }}</p>
			<Button typeStyle="tertiary" :size="btnSize" class="z-[4]" @click.prevent="openSelectFile" :class="buttonClass">{{ secondText }}</Button>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
	modelValue: {
		type: [File, Object],
		default: null
	},
    btnSize: {
        type: String,
        default: 'small'
    },
	title: {
		type: String,
		default: 'Cargar imagenes'
	},
	description: {
		type: String,
		default: 'Archivo con formato .PNG .JPG o .PDF'
	},
    subDescription: {
        type: String,
        default: ''
    },
	firstText: {
		type: String,
		default: 'Suelta aquí tu documento'
	},
	secondText: {
		type: String,
		default: 'Buscar archivo'
	},
	accept: {
		type: String,
		default: 'image/png, image/jpeg, application/pdf'
	},
    buttonClass: {
        type: String,
        default: ''
    },
})

const errorMessage = ref("");
const refFileInput = ref("");

const emit = defineEmits(["update:modelValue"]);

const file = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit("update:modelValue", value)
	}
})

const handleFile = (uploadedFile) => {
	if (!uploadedFile) return;

	file.value = uploadedFile;
	errorMessage.value = "";
};

const onDrop = (event) => {
	event.preventDefault();
	if (event.dataTransfer.files.length) {
		handleFile(event.dataTransfer.files[0]);
	}
};

const onFileChange = (event) => {
	if (event.target.files.length) {
		handleFile(event.target.files[0]);
	}
};

function openSelectFile() {
	refFileInput.value.click()
};

function deleteElement() {
	file.value = {};
	document.getElementById('file-upload').value = ''
}

defineExpose({
	deleteElement
})

</script>

<style scoped>
</style>
