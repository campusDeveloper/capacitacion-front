<template>
    <aside :class="['side-menu-general transition-all ease-linear duration-100 vstack group w-full h-full',
		{ 'shadow-side-menu': shadow, 'menu-general-deploy': withDeploy, 'menu-active': showPopover }, classMenu]"
	>
        <div class="vstack overflow-auto hidden-scroll routes gap-y-5 px-[15px] my-5 h-full">
            <slot />
            <template v-for="(item, i) in menus" :key="i">
                <template v-for="(data, index) in item" :key="index">
                    <div v-if="!data.hidden" :class="`${data.disable ? 'opacity-80 pointer-events-none' : ''}`">
                        <el-popover placement="right" trigger="click" :width="248" :disabled="disablePopper(data)"
							@show="togglePopover(1)" @hide="togglePopover" :show-after="withDeploy ? 200: 0" :offset="0"
							:popper-class="['popper-side-menu', widthPopover]"
						>
                            <template #reference>
                                <cardSideMenu
                                    :data="data"
                                    :isRedirect="!data.children"
                                    :classModule="classModule"
									class="mx-auto"
                                >
									<div class="d-middle-center min-w-6 max-w-6">
										<i :class="[data?.icon, 'text-xl']" />
									</div>
                                </cardSideMenu>
                            </template>
                            <div class="parent-popover vstack px-2 gap-y-1">
                                <router-link
                                    v-for="(children, idx) in data.children"
                                    :key="idx"
                                    :to="{ name: `${children.route}`, params: data.params }"
									class="w-full"
                                >
                                    <div class="d-middle-bt rounded-lg cursor-pointer min-h-[34px] px-4 py-[0.438rem]">
                                        <p class="text-start f-b2m break-normal text-primary first-letter:uppercase">{{ children.name }}</p>
										<optBadge v-if="children.count"
											:number="children.count"
											size="small"
										/>
                                    </div>
                                </router-link>
                            </div>
                        </el-popover>
                        <div :class="['vstack gap-y-1 sub-routes', { 'routes-deploy': withDeploy }]">
                            <router-link
                                v-for="(children, idx) in data.children"
                                :key="idx"
                                :to="{ name: `${children.route}`, params: data.params }"
                                class="d-middle route-children rounded-lg cursor-pointer mx-auto whitespace-break-spaces py-[0.438rem] min-h-[34px] w-full px-4"
                            >
                                <div class="d-middle-bt">
                                    <p class="text-start f-b2m break-normal first-letter:uppercase">{{ children.name }}</p>
									<optBadge v-if="children.count"
										:number="children.count"
										size="small"
									/>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </template>
                <hr class="last-of-type:hidden">
            </template>
            <slot name="footer" />
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue'
import { some } from 'lodash';
import { useRoute } from 'vue-router';
import cardSideMenu from './cardSideMenu.vue';
import optBadge from './optBadge.vue';

const props = defineProps({
    menus: {
        type: Array,
        default: () => []
    },
    shadow: {
        type: Boolean,
        default: true
    },
    withDeploy: {
        type: Boolean,
        default: false
    },
    classModule: {
        type: String,
        default: 'min-h-[36px]'
    },
	classMenu: {
		type: String,
		default: 'max-w-[252px]'
	},
	widthPopover: {
		type: String,
		default: 'max-w-[224px]'
	}
})

const route = useRoute();
const showPopover = ref(false)

function disablePopper(item) {
    let state = true;
    if (item.children) {
        state = item.children.map(el => {
            return some( route.matched, { name: el.route } )
        }).some(el => el == true)
    }
    return state
};

function togglePopover(value){
	showPopover.value = value === 1
}

</script>

<style lang="scss">


%style-hover-card{
    background-color: rgb(var(--xx-color-sidemenu-item-hover));
}

.shadow-side-menu{
    box-shadow: 1px 4px 6px -1px rgba(0, 0, 0, 0.1), 1px 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.side-menu-general {
    @apply bg-[rgb(var(--xx-color-surface-primary))];
    .routes {
        .router-link {
            min-height: 40px;
            border-radius: 8px;
            transition: all .2s ease-in-out;
        }
        .route-father {
			transition: all 100ms linear;
			background-color: rgb(var(--xx-color-sidemenu-item-rest));
            .icon-inactive{
                display: block;
            }
            .icon-active{
                display: none;
            }
			i{
				color: rgb(var(--xx-icon-default));
			}
            color: rgb(var(--xx-color-primary-900));
            &:hover{
				@extend %style-hover-card;
            }
            i.icon-chevron-right{
				color: rgb(var(--xx-color-primary-900));
				font-size: 16px;
            }
            .badge {
				display: none;
                background-color: rgb(var(--xx-badge-item-background));
            }
            &[aria-describedby]{
                @extend %style-hover-card;
				border-radius: 8px 8px 0 0;
            }
			&:not(.router-link-active){
				p {
					@apply text-mid-gray-600;
				}
				i {
					@apply text-brand-500;
				}
			}
        }
        &:has(.route-children .badge){
            .route-father {
                .badge {
                    display: block;
                }
            }
        }
        .text-main{
            font-family: 'Inter';
            font-weight: 400;
        }
        .router-link-active {
            &.route-father {
                background-color: rgb(var(--xx-color-sidemenu-item-pressed));
				font-family: 'GoogleSansFlex-Medium-24pt';
				font-weight: 500;
				font-size: 0.875rem;
                .icon-inactive{
                    display: none;
                }
                .icon-active{
                    display: block;
                }
				p, i {
					@apply text-white-100;
				}
            }
        }
        &:has(.route-children.router-link-active) {
            .route-father {
                color: rgb(var(--xx-sidemenu-item-text-child-select));
                background-color: rgb(var(--xx-sidemenu-item-background-hover));
                font-family: 'Montserrat-Medium';
				font-weight: 500;
				font-size: 0.875rem;
				border-radius: 8px 8px 0 0;
            }
			&:not(:has(.routes-deploy)){
				.route-father {
					.icon-chevron-right{
						color: rgb(var(--xx-sidemenu-item-icon-children-select));
						transform: rotate(90deg);
					}
				}
				.sub-routes {
					display: flex;
					font-size: 0.875rem;
					padding: 12px 8px !important;
					.router-link-active {
						color: rgb(var(--xx-sidemenu-child-text-select));
						background-color: rgb(var(--xx-sidemenu-item-background-select-single));
						font-family: 'Montserrat-Medium';
						font-weight: 500;
						font-size: 0.875rem;
					}
				}
			}
        }
        .sub-routes {
            display: none;
            color: rgb(var(--xx-sidemenu-child-text-default));
			background-color: rgb(var(--xx-color-gray-100));
			border-radius: 0 0 8px 8px;
			padding: 12px 0;
            .route-children{
                &:hover{
                    background-color: rgb(var(--xx-sidemenu-child-background-hover));
                }
                .badge{
                    font-family: 'Inter';
                    font-weight: 700;
                    color: rgb(var(--xx-badge-item-text));
                    background-color: rgb(var(--xx-badge-item-background));
                }
            }
        }
    }
}
.parent-popover{
	padding: 3px 0;
    div:not(.opt-badge-p){
        &:hover{
            background-color: rgb(var(--xx-sidemenu-child-background-hover));
        }
        .badge{
            font-family: 'Inter';
            font-weight: 700;
            color: rgb(var(--xx-badge-item-text));
            background-color: rgb(var(--xx-badge-item-background));
        }
    }
	a {
		margin: auto;
		font-family: 'Montserrat-Medium';
		font-weight: 500;
		font-size: 0.875rem;
	}
}

// Clases del side-menu-general con depliegue.

%active {
	max-width: 264px !important;
	min-width: 264px !important;
	.route-father{
		div.content-icon{
			min-width: 100%;
			max-width: 100%;
			p, .text-toggle {
				min-width: 70%;
				max-width: 70%;
				display: block;
			}
		}
		.badge-number{
			&:not(.with-number){
				right: 42px;
				top: 45%;
			}
			top: 30%;
			right: 16px;
		}
	}
}

.menu-general-deploy{
	max-width: 68px !important;
	min-width: 68px !important;
	z-index: 999;
	transition: all 100ms linear;
	.route-father{
		position: relative;
		overflow: hidden;
		padding: 0 6px;
		div.content-icon{
			min-width: 0%;
			max-width: 0%;
			p, .text-toggle {
				display: none;
			}
		}
		.children-icon {
			display: none;
		}
		.badge-number{
			transition: all .2s linear;
			position: absolute;
			&:not(.with-number){
				right: 3px;
			}
			top: 3px;
			right: 3px;
		}
	}
	&:hover {
		@extend %active;
	}
}

</style>