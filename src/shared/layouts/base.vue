<template>
	<section class="content flex !h-dvh !w-dvw relative overflow-hidden bg-white-200">
		<div class="rounded-xl min-w-[68px]" />
		<sideMenu :withDeploy="true" class="absolute left-0">
			<div class="d-middle gap-x-5 mb-3">
				<img src="/img/icons/logo-cajasan.svg" alt=""
					class="transition-all ease-linear duration-150 min-w-9 size-9 group-hover:size-11 group-hover:min-w-11">
				<div class="vstack w-full text-black-300">
					<div class="d-middle-bt">
						<p class="f-tb-16 line-clamp-1">Bienvenido!</p>
					</div>
					<p class="f-t-14 line-clamp-1">Panel Administrativo</p>
				</div>
			</div>
			<template #footer>
				<div class="min-h-[36px] cursor-pointer rounded mt-auto" @click="logOutUser">
					<cardSideMenu :isRedirect="false" :data="{ name: 'Cerrar sesión' }">
						<div class="d-middle-center min-w-6 max-w-6">
							<i class="icon-logout text-xl" />
						</div>
					</cardSideMenu>
				</div>
			</template>
		</sideMenu>
		<main class="vstack overflow-hidden relative w-dvw">
			<router-view v-slot="{ Component }">
				<TransitionGeneral>
					<component :is="Component" />
				</TransitionGeneral>
			</router-view>
		</main>
	</section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import sideMenu from '@comp/sideMenu.vue';
import cardSideMenu from '@comp/cardSideMenu.vue';
import TransitionGeneral from '@comp/TransitionGeneral.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const refActionChangeState = ref()
const isTransitioning = ref(false);
const emit = defineEmits(['click'])

/* Functions */
async function logOutUser() {
	try {
		await authStore.logout();
		router.push({ name: 'login' });
	} catch (error) {
		console.error('Logout error', error);
	}
}



</script>

<style lang="scss" scoped>
.content {
	background-image: url('/img/generals/Shape.svg');
	background-repeat: no-repeat;
	background-position: 0 90%;
}
</style>