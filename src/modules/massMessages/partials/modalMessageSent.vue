<template>
	<Modal ref="refModalSendingMessaging" width="382" title="Mensajería enviada" action="Ir" :btnCancel="false"
		destroyOnClose :onAction="toGoBack">
		<div class="m-auto size-[90px]">
			<Loading height="100%" :loop="false" />
		</div>
		<p class="text-mid-gray-600 text-center f-t-14 pt-4">Se ha enviado la plantilla seleccionada, revisa los
			detalles del envío en la vista principal</p>
	</Modal>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@comp/Loading.vue';

const refModalSendingMessaging = ref()

const percentage = ref(0)
const router = useRouter()

const emit = defineEmits(['close'])



function toGoBack() {
	router.push({ name: 'massMessages.main' })
}

function open() {
	refModalSendingMessaging.value.open()
}

function close() {
	router.push({ name: 'massMessages.main' })
}

defineExpose({
	open,
	close
})

</script>