<template>
	<section class="d-middle-center w-full h-full relative bg-gray-constants-black">
		<div class="energy-container">
			<div v-for="i in 4" class="wave" />
			<div class="glow" />
			<div class="particle" />
			<div class="core" />
		</div>
		<div
			class="d-middle border-2 border-mid-gray-500 z-10 px-12 pb-12 pt-10 relative rounded-3xl w-[652px] bg-dark-gray-blur gap-x-16">
			<div class="vstack items-center relative w-[153px]">
				<img src="/img/generals/Message@2x.png" alt="" width="87" class="absolute -top-9 -right-4 z-[3]">
				<img src="/img/generals/Body.svg" alt="" class="img-robot z-[2]">
				<img src="/img/generals/Shadow.svg" alt="" width="84" class="absolute -bottom-9 shadow-robot">
			</div>
			<Form @submit="login" class="text-white-400 w-[315px]">
				<p class="f-semibold !text-[32px] my-5 !leading-[1.3]">¡Bienvenido al <br /> Panel Administrativo!</p>
				<Field v-slot="{ field, errorMessage }" name="email" label="email" rules="required|email">
					<div class="form-content mb-8">
						<p class="f-tm-16 pb-1">E-mail</p>
						<el-input v-model="model.email" placeholder="Digita tu correo" size="large"
							class="w-full dark-state" v-bind="field">
							<template #prefix>
								<i class="icon-user !text-3xl !text-white-400" />
							</template>
						</el-input>
						<Error server="root" :local="errorMessage" v-bind="field" />
					</div>
				</Field>
				<Field v-slot="{ field, errorMessage }" name="password" label="contraseña" rules="required">
					<div class="form-content mb-8">
						<p class="f-tm-16 pb-1">Contraseña</p>
						<el-input type="password" v-model="model.password" placeholder="Digita tu contraseña"
							size="large" class="w-full dark-state" v-bind="field">
							<template #prefix>
								<i class="icon-lock !text-3xl !text-white-400" />
							</template>
						</el-input>
						<Error server="root" :local="errorMessage" v-bind="field" />
					</div>
				</Field>
				<Button class="w-full" type="submit" size="large">Iniciar sesión</Button>
			</Form>
			<img src="/img/generals/shape-group.svg" alt=""
				class="absolute animate-shape w-[280px] h-[287px] bottom-[-85px] left-[-110px]">
			<img src="/img/generals/shape-group.svg" alt=""
				class="absolute animate-shape-two rotate-[120deg] w-[280px] h-[287px] top-[-85px] right-[-160px]">
		</div>
	</section>
</template>

<script setup>
import { Field, Form } from 'vee-validate';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useErrors } from '../../../shared/store/errors'

//Constantes
const model = ref({
	email: '',
	password: ''
})
const router = useRouter()
const { hasErrors } = storeToRefs(useErrors())
const refModalResetPassword = ref()
const passwordSent = ref(false)

/* Functions
async function onLogin() {
	router.push({ name: 'configuration' })
}
*/
async function login() {
	try {

		router.push({ name: 'dashboard' });

	} catch (error) {
		console.error(error);
		// mostrar error al usuario (toast / alert)
	}
}

async function recoverPassword() {
	passwordSent.value = true;
}

function openResetPassword() {
	passwordSent.value = false
	refModalResetPassword.value.open()
}

</script>

<style lang="scss" scoped>
.energy-container {
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	bottom: 0;
	transform: translate(0, 60%);
	justify-content: center;
	align-items: center;
}

.core {
	position: absolute;
	width: 300px;
	height: 300px;
	border-radius: 50%;
	background: radial-gradient(ellipse at center,
			rgba(17, 82, 168, 0.4),
			rgba(17, 82, 168, 0.15) 40%,
			rgba(10, 49, 99, 0) 70%);
	z-index: 3;
}

.wave {
	position: absolute;
	width: 300px;
	height: 300px;
	border-radius: 50%;
	background: radial-gradient(ellipse at center,
			rgba(17, 82, 168, 0.3),
			rgba(17, 82, 168, 0.15) 40%,
			rgba(10, 49, 99, 0.05) 60%,
			rgba(10, 49, 99, 0) 80%);
	animation: expand 6s ease-out infinite;
}

.wave:nth-child(2) {
	animation-delay: 0.75s;
}

.wave:nth-child(3) {
	animation-delay: 1.5s;
}

.wave:nth-child(4) {
	animation-delay: 2.25s;
}

@keyframes expand {
	0% {
		transform: scale(1);
		opacity: 1;
	}

	100% {
		transform: scale(6);
		opacity: 0;
	}
}

.particle {
	position: absolute;
	width: 150px;
	height: 150px;
	border-radius: 50%;
	background: radial-gradient(circle,
			rgba(17, 82, 168, 0.2),
			rgba(10, 49, 99, 0) 70%);
	animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
	0% {
		transform: scale(0.8);
		opacity: 0.6;
	}

	100% {
		transform: scale(1.2);
		opacity: 0.3;
	}
}

.glow {
	position: absolute;
	width: 200px;
	height: 200px;
	border-radius: 50%;
	background: radial-gradient(circle,
			rgba(17, 82, 168, 0.5),
			rgba(17, 82, 168, 0) 70%);
	animation: glow-pulse 2s ease-in-out infinite;
	z-index: 2;
}

@keyframes glow-pulse {

	0%,
	100% {
		opacity: 0.5;
		transform: scale(1);
	}

	50% {
		opacity: 0.8;
		transform: scale(1.1);
	}
}

.img-robot {
	animation: move-robot 5s ease-in-out infinite;
}

.shadow-robot {
	animation: move-shadow 5s ease-in-out infinite;
}


@keyframes move-robot {
	0% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(20px);
	}

	100% {
		transform: translateY(0);
	}
}

@keyframes move-shadow {
	0% {
		width: 84px;
	}

	50% {
		width: 110px;
	}

	100% {
		width: 84px;
	}
}

.animate-shape {
	animation: rotate-shape 60s linear infinite;
	transform-origin: center;
	z-index: -1;
}

.animate-shape-two {
	animation: rotate-shape 60s linear infinite reverse;
	transform-origin: center;
	z-index: -1;
}

@keyframes rotate-shape {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
