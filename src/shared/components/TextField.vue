<template>
	<div ref="fieldDiv" class="vstack transition-all bg-white-constants-white duration-100 ease-linear textarea-div" >
		<div class="flex">
			<el-input
				v-model="writeMessage"
				:placeholder="placeholder"
				:autosize="autosize"
				:maxlength="maxlength"
				type="textarea"
				resize="none"
				class="wo-class"
			/>
			<div class="flex ms-auto h-min gap-x-2">
				<i class="icon-send text-xl cursor-pointer text-brand-500"  @click="sendMessage" />
			</div>
		</div>
	</div>
</template>

<script setup>
import{ ref, computed } from 'vue'

const props = defineProps({
	modelValue: {
		default: ''
	},
	placeholder: {
		type: String,
		default: 'Deja un comentario'
	},
	maxlength: {
		default: 500
	},
	autosize: {
		type: Object,
		default: { minRows: 2, maxRows: 5 }
	},
	woOpenFile: {
		type: Boolean,
		default: false
	}
})

const fieldDiv = ref()

const emit = defineEmits(['update:modelValue', 'deleteFile', 'sendMessage'])

const writeMessage = computed({
	get(){ return props.modelValue },
	set(newValue){ emit('update:modelValue', newValue) }
})

/* Functions */
function sendMessage(){
	emit('sendMessage', writeMessage.value)
	writeMessage.value = ""
}

defineExpose({
	fieldDiv
})

</script>

<style lang="scss" scoped >
.textarea-div {
	outline-width: 1px;
	outline-style: solid;
	outline-color: rgb(var(--xx-color-border-secondary));
	outline-offset: -1px;
	border-radius: 8px !important;
	padding: 8px;
	background-color: rgb(var(--xx-color-action-menu-surface));
	&:hover{
		outline-width: 1px;
		outline-style: solid;
		outline-color: rgb(var(--xx-color-white-700));
		outline-offset: -1px;
	}
	&:has(.el-textarea__inner:focus-visible){
		outline-width: 1px;
		outline-style: solid;
		outline-color: rgb(var(--xx-color-border-brand));
		outline-offset: -1px;
		box-shadow: var(--xx--shadow-input-focus) !important;
	}
}

</style>