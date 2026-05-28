<template>
	<ModalRight ref="refModalComments" title="Comentarios" width="400">
		<div class="vstack sticky top-0 z-[3] gap-y-1 pt-3 pb-1">
			<p class="text-black-300 f-tm-14 pb-2">Deja un comentario</p>
			<TextField :disabled="loading" v-model="comment" placeholder="Deja un comentario" :autosize="{ minRows: 3, maxRows: 3 }"
				@sendMessage="sendMessage" :maxlength="250" />
		</div>
		<el-scrollbar view-class="h-full" style="height: calc(100vh - 300px);">
			<div class="vstack gap-y-3 pb-4">
				<CardComments v-for="value in comments" class="w-full" :info="value" />
			</div>
		</el-scrollbar>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { request } from "@request"
import TextField from '@comp/TextField.vue';
import CardComments from '@comp/CardComments.vue'
import { createOpportunityComment, getOpportunityComments } from '../services/trackingLeadsService'


const refModalComments = ref()

const idOpportunityRef = ref(null)
const comment = ref('')

const emit = defineEmits(["increaseComment"])

const loading = ref(false)
const comments = ref([])


async function open() {
	refModalComments.value.open()
	comment.value = ""
	comments.value = []
	idOpportunityRef.value = null
}

function mapComment(value) {
	return {
		...value,
		creator: value.creator ?? value.user ?? value.User ?? {
			name: value.name ?? value.Name ?? '-'
		},
		createdAt: value.createdAt ?? value.CreatedAt ?? value.creationDate ?? value.date,
		comment: value.comment ?? value.Comment ?? ''
	}
}

async function loadComments(idOpportunity) {
	if (!idOpportunity) return
	loading.value = true
	const { data, error } = await request(() => getOpportunityComments(idOpportunity), { success: false, error: true })

	if (!error) {
		const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
		comments.value = list.map(mapComment)
	}

	loading.value = false
}

async function sendMessage() {
	if (!idOpportunityRef.value || !comment.value?.trim() || loading.value) return
	loading.value = true

	const payload = {
		comment: comment.value.trim()
	}

	const { error } = await request(
		() => createOpportunityComment(idOpportunityRef.value, payload),
		{ success: true, error: true }
	)

	if (!error) {
		emit('increaseComment', idOpportunityRef.value)
		comment.value = ''
		await loadComments(idOpportunityRef.value)
	}

	loading.value = false
}

async function openByOpportunity(idOpportunity) {
	refModalComments.value.open()
	comment.value = ""
	idOpportunityRef.value = idOpportunity
	await loadComments(idOpportunity)
}


defineExpose({
	open: openByOpportunity,
})

</script>
