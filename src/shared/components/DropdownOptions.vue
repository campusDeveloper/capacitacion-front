<template>
    <el-dropdown :trigger="trigger" :placement="placement" :show-arrow="false" :popper-class="popperClass">
        <slot name="reference">
            <div class="rounded-lg d-middle-center cursor-pointer !outline-none hover:bg-white-500" :class="size" @click.stop>
				<i :class="`${icon} ${sizeIcon} text-[rgb(var(--xx-color-text-secondary))]`" />
            </div>
        </slot>
        <template #dropdown>
            <el-dropdown-menu class="!px-2">
				<el-dropdown-item
					v-for="(data, index) in options"
					class="each-item d-middle rounded-lg mx-2 h-[32px] max-w-[300px] ps-2 pe-4"
					:key="index"
					@click="data?.action ? data.action(params) : null"
					:disabled="disabled.includes(data.option) || data.disabled === true"
				>
					<template v-if="!data.replaceContent">
						<i v-if="data.icon" :class="`${data.danger ? 'text-danger' : 'primary'} ${data.icon} text-lg me-0`" />
						<p class="f-t-14 tres-puntos"
							:class="{
								'text-danger': data.danger && !disabled.includes(data.option),
								'text-black-300': !data.danger,
								}"
							:style="{ cursor: disabled.includes(data.option) ||  data.disabled === true ? 'not-allowed' : 'pointer' }"
							>
							{{ data.option }}</p>
					</template>
					<slot v-else name="content" />
				</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup>

const props = defineProps({
	options: {
		type: Array,
		default: () => []
	},
	trigger: {
		type: String,
		default: 'hover',
	},
	size: {
		type: String,
		default: 'size-[30px]',
	},
	icon: {
		type: String,
		default: 'icon-more-vert',
	},
	sizeIcon: {
		type: String,
		required: false,
		default: 'text-xl'
	},
	placement: {
		type: String,
		default: 'bottom',
	},
	params: {
		default: undefined
	},
	disabled: {
		type: Array,
		default: () => []
	},
	popperClass: {
		type: String,
		default: ''
	}
})
</script>

<style lang="scss" scoped>
.options-hover{
    &.inverse{
        &:hover{
            // background: #ffffff;
        }
    }
}
p{
	user-select: none;
	&:not(.cr-pointer){
		cursor: default;
	}
}
.each-item{
	i::before{
		margin-left: 0px;
	}
    .text-danger {
        color: rgb(var(--xx-color-text-danger));
    }
}
</style>
