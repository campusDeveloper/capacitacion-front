<template>
	<ModalRight ref="refModalComments" title="Comentarios" width="400" @close="handleClose">
		<Form ref="refFormComment" :initial-values="form" class="vstack gap-y-2 mb-4">
			<Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="comment" label="comentario"
				rules="required|max:250">
				<el-input
					type="textarea"
					:model-value="form.comment"
					:name="field.name"
					placeholder="Digita tu comentario"
					:autosize="{ minRows: 4, maxRows: 4 }"
					:maxlength="250"
					show-word-limit
					:disabled="loading || saving"
					@update:model-value="(value) => handleCommentChange(value, handleChange)"
					@blur="handleBlur"
				/>
				<Error server="comment" :local="errorMessage" :value="form.comment" />
			</Field>
			<div class="d-middle-end">
				<Button :disabled="loading || saving" class="min-w-[112px]" @click="createComment">
					Guardar
				</Button>
			</div>
		</Form>
		<el-scrollbar view-class="h-full" style="height: calc(100vh - 265px);">
			<div v-loading="loading" class="vstack gap-y-3 pb-4 min-h-[120px]">
				<div v-for="value in comments" :key="value.idComment"
					class="vstack gap-y-2 bg-white-100 rounded-lg p-5 shadow-[0_1px_2px_0_rgba(191,191,191,0.05)]">
					<div class="d-middle-bt gap-x-3">
						<p class="text-mid-gray-600 f-tm-16 line-clamp-1">{{ value.user ?? '-' }}</p>
					</div>
					<p class="text-mid-gray-200 f-t-12">{{ value.createdAt ? DateFormat(value.createdAt, 'DD MMM YYYY HH:mm a') : '-' }}</p>
					<p class="f-t-12 text-black-300 break-words">{{ value.comment }}</p>
				</div>
				<div v-if="!loading && comments.length === 0" class="d-middle-center h-[120px]">
					<p class="f-t-12 text-mid-gray-300">Sin comentarios</p>
				</div>
			</div>
		</el-scrollbar>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { DateFormat } from '@/util/dateFormat.js'
import { request } from "@request";
import { Field, Form } from 'vee-validate'
import { useErrors } from '@/shared/store/errors';
import { createCustomerComment, getCustomerComments } from '../services/clientService';

const refModalComments = ref()
const refFormComment = ref()

const idCustomerRef = ref(null)
const form = ref({
	comment: ''
})

const emit = defineEmits(["updateCommentCount"])

const loading = ref(false)
const saving = ref(false)
const comments = ref([])
const { setErrors } = useErrors()

/* Functions */
function resetForm() {
	form.value.comment = ''
	refFormComment.value?.resetForm({
		values: { ...form.value }
	})
}

function clearErrors() {
	setErrors({})
}

function handleCommentChange(value, handleChange) {
	form.value.comment = value
	handleChange(value)
}

async function fetchComments() {
	if (!idCustomerRef.value || loading.value) return

	loading.value = true

	try {
		const { data, error } = await request(() => getCustomerComments(idCustomerRef.value), false)

		if (error) {
			comments.value = []
			return
		}

		comments.value = Array.isArray(data) ? data : (data?.data || [])
		emit('updateCommentCount', idCustomerRef.value, comments.value.length)
	} finally {
		loading.value = false
	}
}

async function createComment() {
	if (!idCustomerRef.value || loading.value || saving.value) return

	const validationResult = await refFormComment.value?.validate()
	if (!validationResult?.valid) return

	if (!form.value.comment.trim()) {
		refFormComment.value?.setFieldError('comment', 'El campo comentario es obligatorio')
		return
	}

	const payload = {
		comment: form.value.comment.trim()
	}

	saving.value = true

	try {
		const { error } = await request(() => createCustomerComment(idCustomerRef.value, payload), false)
		if (error) return

		resetForm()
		clearErrors()
		await fetchComments()
	} finally {
		saving.value = false
	}
}

async function open(idCustomer) {
	if (!idCustomer || loading.value || saving.value) return

	idCustomerRef.value = idCustomer
	comments.value = []
	resetForm()
	clearErrors()
	refModalComments.value.open()
	await fetchComments()
}

function handleClose() {
	idCustomerRef.value = null
	comments.value = []
	resetForm()
	clearErrors()
}

defineExpose({
	open
})

</script>
