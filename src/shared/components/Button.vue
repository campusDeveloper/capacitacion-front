<template>
	<button ref="refBtn" :type="type" class="transition f-tm-14 w-fit rounded-lg ease-in-out duration-200" :disabled="disabled" :class="`btn-${typeStyle} btn-${size} ${disabled ? 'disabled' : ''}`">
		<slot />
	</button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	type: {
		type: String,
		default: 'buttom'
	},
	typeStyle: {
		type: String,
		default: 'primary'
	},
	size: {
		type: String,
		default: 'medium'
	},
	disabled: {
		type: Boolean,
		default: false
	},
	refBtn: {
		type: String,
		default: ''
	}
})

const refBtn = ref()

/* Functions */
function active(){
	refBtn.value.active
}

defineExpose({
	active
})

</script>

<style lang="scss">
@import '@/assets/styles/tailwind.scss';

button i {
	transition: color 0.2s;
}

.btn-primary {
	color: rgb(var(--xx-color-white-100));
	background-color: rgb(var(--xx-color-button-primary-rest));
	i {
		color: rgb(var(--xx-color-white-100));
	}
	&:hover {
		background-color: rgb(var(--xx-color-button-primary-hover));
		color: rgb(var(--xx-color-white-100));
		i {
			color: rgb(var(--xx-color-white-100));
		}
	}
	&.disabled {
		background-color: rgb(var(--xx-color-button-primary-disabled));
		color: rgb(var(--xx-color-white-100));
		cursor: not-allowed !important;
		i {
			color: rgb(var(--xx-button-primary-icon-disable));
		}
	}
	&:not(.disabled):active {
		background-color: rgb(var(--xx-color-button-primary-pressed));
	}
}
.btn-secondary {
	color: rgb(var(--xx-color-white-100));
	background-color: rgb(var(--xx-color-button-secondary-rest));
	i {
		color: rgb(var(--xx-color-white-100));
	}
	&:hover {
		background-color: rgb(var(--xx-color-button-secondary-hover));
	}
	&.disabled {
		background-color: rgb(var(--xx-color-button-secondary-disabled));
		color: rgb(var(--xx-color-white-100));
		cursor: not-allowed !important;
		i {
			color: rgb(var(--xx-color-white-100));
		}
	}
	&:not(.disabled):active {
		background-color: rgb(var(--xx-color-button-secondary-pressed));
		color: rgb(var(--xx-color-white-100));
		i {
			color: rgb(var(--xx-color-white-100));
		}
	}
}

.btn-tertiary {
	@apply text-[rgb(var(--xx-color-brand-700))];
	background-color: transparent;
	border: 1px solid rgb(var(--xx-color-button-ghost-border));
	i {
		@apply text-[rgb(var(--xx-color-brand-700))];
	}
	&:hover {
		@apply bg-[rgb(var(--xx-color-blue-cj-50))];
		@apply text-[rgb(var(--xx-color-brand-700))];
		i {
			@apply text-[rgb(var(--xx-color-brand-700))];;
		}
	}
	&.disabled {
		@apply bg-[transparent] border-[rgb(var(--xx-color-button-ghost-border-disabled))];
		color: rgb(var(--xx-color-white-700));
		cursor: not-allowed !important;
		pointer-events: none;
		i {
			color: rgb(var(--xx-color-white-700));
		}
	}
	&:not(.disabled):active {
		background-color: rgb(var(--xx-color-button-ghost-pressed));
		@apply text-[rgb(var(--xx-color-blue-cj-700))];
		i {
			@apply text-[rgb(var(--xx-color-blue-cj-700))];
		}
	}
}

.btn-danger {
	color: rgb(var(--xx-color-white-100));
	background-color: rgb(var(--xx-color-button-danger-rest));
	i {
		color: rgb(var(--xx-color-white-100));
	}
	&:not(.disabled):hover {
		color: rgb(var(--xx-color-white-100));
		background-color: rgb(var(--xx-color-button-danger-hover));
		i {
			color: rgb(var(--xx-color-white-100));
		}
	}
	&.disabled {
		cursor: not-allowed !important;
		background-color: rgb(var(--xx-color-gray-300));
		color: rgb(var(--xx-color-white-100));
		i {
			color: rgb(var(--xx-color-white-100))
		}
	}
	&:not(.disabled):active {
		background-color: rgb(var(--xx-color-button-danger-pressed));
		color: rgb(var(--xx-color-white-100));
		i {
			color: rgb(var(--xx-color-white-100));
		}
	}
}

.btn-link {
	color: rgb(var(--xx-color-button-link-text-rest));
	padding-left: 0rem !important;
	padding-right: 0rem !important;
	text-decoration: underline;
	background-color: transparent;
	i {
		color: rgb(var(--xx-color-button-link-text-rest));
	}
	&:not(.disabled):hover {
		text-decoration: underline;
		color: rgb(var(--xx-color-button-link-text-hover));
		i {
			color: rgb(var(--xx-color-button-link-text-hover));
		}
	}
	&.disabled {
		cursor: not-allowed !important;
		color: rgb(var(--xx-color-gray-300));
		i {
			color: rgb(var(--xx-color-gray-300))
		}
	}
	&:not(.disabled):active {
		color: rgb(var(--xx-color-button-link-text-pressed));
		i {
			color: rgb(var(--xx-color-button-link-text-pressed));
		}
	}
}

.btn-xlarge {
	height: 52px;
	min-width: 52px;
	padding-left: 12px;
	border-radius: 4px;
	padding-right: 12px;
	@apply f-ts-16;
	i {
		font-size: 1.25rem;
	}
}

.btn-large {
	height: 44px;
	min-width: 44px;
	padding-left: 12px;
	border-radius: 4px;
	padding-right: 12px;
	@apply f-ts-16;
	i {
		font-size: 1.25rem;
	}
}
.btn-medium {
	height: 36px;
	min-width: 36px;
	padding-left: 12px;
	border-radius: 4px;
	padding-right: 12px;
	@apply f-ts-14;
	i {
		font-size: 0.875rem;
	}
}
.btn-small {
	height: 28px;
	min-width: 32px;
	padding-left: 12px;
	border-radius: 4px;
	padding-right: 12px;
	@apply f-ts-12;
	i {
		font-size: 0.75rem;
	}
}
.btn-xsmall {
	height: 24px;
	min-width: 28px;
	padding-left: 12px;
	border-radius: 4px;
	padding-right: 12px;
	@apply f-ts-12;
	i {
		font-size: 0.75rem;
	}
}
</style>