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


const refModalComments = ref()

const idOpportunityRef = ref(null)
const comment = ref('')

const emit = defineEmits(["increaseComment"])

const loading = ref(false)
const comments = ref([])


async function open() {
	refModalComments.value.open()
	comment.value = ""
}


defineExpose({
	open,
})

</script>
