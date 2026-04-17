<template>
	<div :class="['rounded-lg p-3 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] cursor-pointer border border-[transparent]',
		selected ? 'bg-green-s-50' : 'bg-white-50 hover:bg-white-300']">
		<div class="d-middle mb-1">
			<p class="text-mid-gray-600 f-tm-12 me-auto">{{ data?.code }}</p>
			<i class="icon-eye-fill text-mid-gray-300 cursor-pointer" @click.stop="handleActionEye" />
			<slot name="actions" />
		</div>
		<pre class="f-t-10">{{ data.description }}</pre>
	</div>
</template>

<script setup>

const props = defineProps({
	data: {
		type: Object,
		required: true,
		default: () => ({
			code: 'Plantilla_Bienvenida',
			description: '¿Qué tal un plan relajación con tu familia este finde? 🏕️ Tenemos las mejores opciones para ti 💙, en la...'
		})
	},
	selected: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['handleActionEye'])

/* Functions */
function handleActionEye() {
	emit('handleActionEye', props.data)
}

</script>