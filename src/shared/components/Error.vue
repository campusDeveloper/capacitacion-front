<template>
	<div v-if="showError">
		<p v-if="local" class="form-error">
			<span :class="{ 'op-0': !local }">{{ local }}</span>
		</p>
		<p v-else-if="hasErrors" class="form-error">{{ serverError }}</p>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useErrors } from '../store/errors';


const props = defineProps({
	value: {
		default: null
	},
	showError: {
		type: Boolean,
		required: false,
		default: true
	},
	local: {
		type: String,
		required: false,
		default: null
	},
	server: {
		type: String,
		default: ''
	}
})

const { errors, hasErrors } = storeToRefs(useErrors());
const serverError = ref(null);

watch(() => props.value, () => {
	resetError()
});

watch(() => errors.value?.[props.server]?.[0], (newValue) => {
	serverError.value = newValue;
});

function resetError(){
	if(errors.value?.[props.server]) delete errors.value[props.server];
}

defineExpose({ resetError });
</script>

<style scoped lang="scss">
.form-error{
	font-family: 'Inter', Helvetica, Arial, sans-serif !important;
	font-weight: 400;
	font-size: 0.75rem;
	color: rgb(var(--xx-color-red-semantic-600));
	span{
		transition: opacity .2s ease-in;
	}
}
</style>