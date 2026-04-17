<template>
	<ModalRight ref="refModalComments" title="Comentarios" width="400">
		<el-input type="textarea" v-model="comment" placeholder="Digita tu comentario"
			:autosize="{ minRows: 4, maxRows: 4 }" :maxlength="250"  />
		<Button :disabled="loading" class="min-w-[112px] my-3" @click="createComment" > Guardar</Button>
		<div v-for="value in comments" :key="value.idCustomer"
			class="vstack gap-y-2 bg-white-100 rounded-2xl p-5 mb-3 shadow-[0_1px_2px_0_rgba(191,191,191,0.05)]">
			<p class="text-mid-gray-600 f-tm-16">{{ value.creator?.name }}</p>
			<p class="text-mid-gray-200 f-t-12">{{ DateFormat(value.createdAt, 'DD MMM YYYY HH:mm a') }}</p>
			<p class="f-t-12 text-black-300">{{ value.comment }}</p>
		</div>
	</ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { DateFormat } from '@/util/dateFormat.js'
import { request } from "@request";

const refModalComments = ref()

const idCustomerRef = ref(null)
const comment = ref('')

const emit = defineEmits(["increaseComment"])

const loading = ref(false)
const comments = ref([])

/* Functions */
async function open() {
	refModalComments.value.open()
	
}

defineExpose({
	open
})

</script>