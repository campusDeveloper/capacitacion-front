<template>
	<div v-if="viewModal" class="modal-full vstack bg-[rgb(var(--xx-color-surface-secondary))]" :class="{'slide-out-elliptic-top-bck': outModal}">
		<slot name="clear">
			<div class="bg-[rgb(var(--xx-color-surface-tertiary))] text-mid-gray-600 py-5" style="box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
				<div class="flex items-start mx-auto w-[90%]">
                    <i class="icon-arrow-outline-left !text-2xl self-center cursor-pointer" @click="close" />
					<div class="w-full ps-6">
						<div class="flex w-full">
							<p :class="['f-semibold !text-[32px]', classTitle ]">{{ title }}</p>
							<slot name="header-right" />
						</div>
						<slot name="header-bottom" />
					</div>
				</div>
			</div>
			<div class="vstack overflow-hidden h-full w-full bg-[rgb(var(--xx-color-surface-secondary))]" :class="classContent">
				<slot name="wo-scroll">
					<el-scrollbar class="h-full">
						<div class="h-full pb-9" :class="{ 'pt-9': !woPadding }">
							<slot />
						</div>
					</el-scrollbar>
				</slot>
			</div>
		</slot>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	classContent: {
		type: String,
		default: 'w-[90%] ps-20 mx-auto'
	},
	woPadding: {
		type: Boolean,
		default: false
	},
	classTitle: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['close']);
const viewModal = ref(false);
const outModal = ref(false);

function open() {
	outModal.value = false
	viewModal.value = true
};
function close() {
	outModal.value = true
	setTimeout(() => {
		viewModal.value = false
		emit('close');
	}, 200);
};

defineExpose({
	open,
	close
})

</script>

<style lang="scss" scoped>
.modal-full {
	left: 0;
	bottom: 0;
	width: 100vw;
	z-index: 3000;
	position: fixed;
	height: 100vh;
	-webkit-animation: slide-in-elliptic-top-fwd 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
			animation: slide-in-elliptic-top-fwd 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.slide-out-elliptic-top-bck {
	-webkit-animation: slide-out-elliptic-top-bck 0.2s ease-in both;
			animation: slide-out-elliptic-top-bck 0.2s ease-in both;
}

@-webkit-keyframes slide-out-elliptic-top-bck {
	0% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}

	100% {
		-webkit-transform: translateY(-1000px);
		transform: translateY(-1000px);
		opacity: 0;
	}
}

@keyframes slide-out-elliptic-top-bck {
	0% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}

	100% {
		-webkit-transform: translateY(-1000px);
		transform: translateY(-1000px);
		opacity: 0;
	}
}


@-webkit-keyframes slide-in-elliptic-top-fwd {
	0% {
		-webkit-transform: translateY(-1000px);
		transform: translateY(-1000px);
		opacity: 0;
	}

	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes slide-in-elliptic-top-fwd {
	0% {
		-webkit-transform: translateY(-1000px);
		transform: translateY(-1000px);
		opacity: 0;
	}

	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}
}
</style>
