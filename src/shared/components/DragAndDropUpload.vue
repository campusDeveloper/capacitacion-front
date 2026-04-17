<template>
	<div class="d-middle-bt w-full min-h-[95px] border-dashed border-2 border-blue-s-400 rounded-lg px-4"
		@dragover.prevent @dragenter.prevent @drop="onDrop">
		<div class="rounded-full size-[56px] relative">
			<i :class="['absolute -right-2 -top-2 cursor-pointer', withFile ? 'icon-edit-2' : 'icon-arrow-up-box']"
				@click.prevent="openSelectFile" />
			<i class="absolute -right-2 -bottom-2 cursor-pointer text-red-s-600 icon-close-circle"
				@click.prevent="removeFile" v-if="withFile" />
			<img :src="img" alt="" @error="(e) => { e.target.src = '/img/trash/image-upload.png' }"
				class="w-full h-full rounded-lg object-cover">
				<input ref="refFileInput" id="file-upload" type="file" @change="onFileChange" :accept="accept" hidden />
		</div>
		<div class="vstack gap-y-2">
			<p class="text-mid-gray-600 f-tm-12">{{ title }}</p>
			<p class="f-tm-12">{{ description }}</p>
			<p class="f-t-12">{{ text }}</p>
		</div>
	</div>

</template>

<script setup>
import { computed, ref } from "vue";
import { FileToBase64 } from "@/util/fileToBase64";
import { ElMessage } from "element-plus";


const props = defineProps({
	modelValue: {
		type: File,
		default: null
	},
	title: {
		type: String,
		default: 'Arrastra tu imagen al recuadro o haz click para cargarla'
	},
	description: {
		type: String,
		default: 'Tamaño permitidos. Proporción 1:1, 200x200px'
	},
	text: {
		type: String,
		default: 'Peso máximo 10 MB'
	},
	secondText: {
		type: String,
		default: 'Buscar archivo'
	},
	accept: {
		type: String,
		default: 'image/png, image/jpeg'
	}
})

const errorMessage = ref("");
const refFileInput = ref("");
const withFile = ref(false);
const img = ref("");

const emit = defineEmits(["update:modelValue"]);

const file = computed({
	get: () => props.modelValue,
	set: (value) => {
		console.log('value', value);

		emit("update:modelValue", value)
	}
})

const handleFile = async (uploadedFile) => {
	if (!uploadedFile) return;

	const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
	const maxSize = 10 * 1024 * 1024; // 10MB

	if (!allowedTypes.includes(uploadedFile.type)) {
		errorMessage.value = "Solo se permiten imágenes (JPG, PNG).";
		file.value = null;
		withFile.value = false;
		img.value = "";

		ElMessage.error("Solo se permiten imágenes (JPG, PNG).");
		return;
	}

	if (uploadedFile.size > maxSize) {
		errorMessage.value = "La imagen no puede superar los 10MB.";
		file.value = null;
		withFile.value = false;
		img.value = "";

		ElMessage.error("La imagen no puede superar los 10MB.");
		return;
	}

	img.value = await FileToBase64(uploadedFile);
	withFile.value = true;
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

function removeFile() {
	const input = document.getElementById("file-upload");
	input.value = "";
	withFile.value = false;
	img.value = "";
	file.value = null;
}

</script>

<style scoped></style>