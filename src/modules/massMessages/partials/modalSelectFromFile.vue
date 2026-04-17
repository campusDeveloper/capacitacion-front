<template>
	<ModalFull ref="refModalSelectFromFile" title="Seleccionar desde archivo">
		<div class="vstack w-[95%]" style="min-height: calc(100vh - 160px);">
			<div class="rounded-lg bg-brand-50 p-5 mb-12">
				<p class="f-t-12">En esta sección puedes cargar un archivo con la información general de tus clientes
					para facilitar el envío de mensajería masiva. El sistema procesa y organiza los datos
					automáticamente, permitiéndote gestionar los destinatarios de forma eficiente, reducir errores
					manuales y asegurar que las comunicaciones se envíen de manera ordenada y conforme a la información
					registrada.</p>
				<div v-if="dataListClients.length"
					class="d-middle gap-x-1 bg-red-s-50 rounded-lg px-2 mt-4 h-[26px] w-fit">
					<i class="icon-info-circle text-red-s-600" />
					<p class="text-red-s-600 f-t-12">Revisa muy bien los clientes a los que enviarás la plantilla
						seleccionada. Una vez enviada la mensajería, no podrás deshacer esta acción.</p>
				</div>
			</div>
			<div class="flex text-black-300 f-tm-14 items-end overflow-hidden z-[2] gap-x-4 mb-5">
				<p class="f-tm-16 text-mid-gray-600 me-auto">Lista de clientes <span v-if="amountSelected">({{
					amountSelected }})</span></p>
				<Button @click="openSelectTemplate" type-style="tertiary" class="!min-w-[158px]">Seleccionar
					plantilla</Button>
				<Button type-style="tertiary" class="!min-w-[180px]" @click="handleDownloadTemplate">Descargar
					formato</Button>
				<Button @click="openUploadFile" class="!min-w-[140px]">Subir archivo</Button>
				<Button @click="handleSendSelected" :disabled="!amountSelected || !templateSelected"
					class="!min-w-[213px]">Enviar ({{
						amountSelected }} seleccionados)</Button>
			</div>
			<div v-if="templateSelected" class="d-middle gap-x-4 mb-5">
				<p class="f-tm-14">Plantilla seleccionada:</p>
				<cardTemplate class="!cursor-default !bg-white-50 w-[362px]" :data="refCardTemplate"
					@handleActionEye="openTemplatePreview">
					<template #actions>
						<i class="icon-close text-mid-gray-300 cursor-pointer" @click="openRemoveTemplate" />
					</template>
				</cardTemplate>
			</div>
			<EmptyView v-if="dataListClients.length === 0" class="my-auto" :data="{
				title: 'Sin archivo',
				description: 'Sube un archivo para cargar la lista de clientes en esta sección'
			}" />

			<!-- 3️⃣ Hay clientes -->
			<el-table v-if="dataListClients.length > 0" :data="dataListClients" class="!w-fit"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column label="Nombre" prop="name" width="225" />
				<el-table-column label="# Teléfono" prop="phone" width="150" />
			</el-table>
		</div>
		<ModalForm ref="refModalUploadFile" title="Subir archivo" width="385" cancel="Cancelar" action="Subir"
			destroyOnClose :onAction="handleUploadFile">
			<Field v-slot="{ field, errorMessage, handleChange }" name="fileName" rules="required">
				<DragAndDropFile ref="refDragAndDrop" :modelValue="field.value"
					@update:modelValue="file => onFileChange(file, handleChange)" title="Adjunta el documento"
					description="Archivos con formato .XSLX o XLS" subDescription="Peso máximo 10 MB"
					accept=".xlsx,.xls" />
				<div v-if="document?.name"
					class="d-middle rounded-lg bg-mid-gray-50 h-7 px-2 f-t-12 w-fit text-gray-constants-black my-3">
					{{ document.name }}
					<i class="icon-close-circle text-black-300 cursor-pointer" @click="deleteFile(handleChange)" />
				</div>
				<Error class="mt-1" :local="errorMessage" />
			</Field>
		</ModalForm>
		<modalPreviewTemplate ref="refModalPreviewTemplate" />
		<modalSelectTemplate ref="refModalSelectTemplate" @handleTemplate="handleTemplate" />
		<Modal ref="refModalRemoveTemplate" width="382" type="danger" action="Quitar" title="Quitar plantilla"
			:onAction="handleRemoveTemplate">
			<p>¿Deseas quitar la plantilla? Al hacerlo, deberás volver a seleccionar una de la lista.</p>
		</Modal>
		<Modal ref="refModalSendmassMessaging" width="382" type="danger" action="Enviar"
			title="Enviar mensajería masiva" :onAction="handleSendmassMessaging">
			<p class="text-center">¿Estás seguro de enviar la mensajería? Una vez enviada, no podrás deshacer esta
				acción.</p>
			<p class="text-center f-tm-16 mt-4 mb-1">{{ amountSelected }} Clientes seleccionados</p>
		</Modal>
		<modalMessageSent ref="refModalSendingMessaging" @close="closeSendingMessaging" />
	</ModalFull>
</template>

<script setup>
import { ref } from 'vue';
import { Field, useForm } from 'vee-validate';
import DragAndDropFile from '@comp/DragAndDropFile.vue';
import cardTemplate from '../components/cardTemplate.vue'
import modalPreviewTemplate from './modalPreviewTemplate.vue';
import modalSelectTemplate from './modalSelectTemplate.vue';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { notify } from "../utils/notify";
import modalMessageSent from '../partials/modalMessageSent.vue'
import { request } from "@request";

const { resetForm, setFieldValue } = useForm();
const refModalSelectFromFile = ref()
const refModalUploadFile = ref()
const refModalRemoveTemplate = ref()
const refModalSendmassMessaging = ref()
const templateSelected = ref(false)
const refModalPreviewTemplate = ref()
const refModalSelectTemplate = ref()
const refDragAndDrop = ref()
const refCardTemplate = ref(null)
const REQUIRED_COLUMNS = ["nombre", "telefono"];
const MAX_ROWS = 50;
const selectedCustomers = ref([])
const refModalSendingMessaging = ref()

const document = ref({})
const amountSelected = ref(0)

const dataListClients = ref([])


function openSelectTemplate() {
	refModalSelectTemplate.value.open()
}

function handleTemplate() {
	refModalSelectTemplate.value.close()
}

function openUploadFile() {
	refModalUploadFile.value.open()
}

function handleSendSelected() {
	refModalSendmassMessaging.value.open()
}

function openTemplatePreview() {
	refModalPreviewTemplate.value.open()
}

function onFileChange() {
}

function openRemoveTemplate() {
	refModalRemoveTemplate.value.open()
}

function handleRemoveTemplate() {
	refModalRemoveTemplate.value.close()
}

function handleSelectionChange() {
}

function deleteFile() {
}

function open() {
	refModalSelectFromFile.value.open()
}

function closeSendingMessaging() {
}

defineExpose({
	open
})

</script>