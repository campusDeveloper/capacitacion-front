<template>
	<section class="vstack overflow-hidden h-full w-full">
		<Navbar name="Configuración" />
		<el-scrollbar view-class="p-6">
			<template v-for="item in list" :key="item.id">
				<p class="text-mid-gray-600 f-tm-16 mt-2">{{ item.titulo }}</p>
				<div class="flex flex-wrap gap-5 my-5">
					<cardConfig v-for="data in item.data" :key="data.id" :data="data"
						@click="toGoView(data.routeName)"
					/>
				</div>
			</template>
		</el-scrollbar>
	</section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import cardConfig from '../components/cardConfig.vue';

const router = useRouter();

const list = [
	{
		id: 90,
		titulo: 'Seguimiento de leads',
		data: [
			{
				id: 56,
				foto: '/img/illustrations/interes.svg',
				nombre: 'Estados de interés',
				routeName: 'configuration.interest',
				descripcion: 'Configura los estados de interés para clasificar a los leads según su intención de compra.'
			},
			{
				id: 12,
				foto: '/img/illustrations/seguimiento.svg',
				nombre: 'Seguimiento',
				routeName: 'configuration.follow',
				descripcion: 'Administra el seguimiento y los estados que representan el avance de cada cliente o lead dentro del proceso inicial.'
			},
			{
				id: 56,
				foto: '/img/illustrations/clientes.svg',
				nombre: 'Tipos de cliente',
				routeName: 'configuration.type.client',
				descripcion: 'Administra las diferentes etiquetas que puedes usar para clasificar a los clientes dentro del sistema.'
			},
		]
	},
	{
		id: 12,
		titulo: 'Gestión de Agentes y Conocimiento',
		data: [
			{
				id: 89,
				foto: '/img/illustrations/categorias-agentes.svg',
				nombre: 'Configuración Agente IA',
				routeName: 'configuration.agent.IA',
				descripcion: 'Configura los diferentes parámetros de comportamiento del Agente IA'
			},
			{
				id: 56,
				foto: '/img/illustrations/conocimiento.svg',
				nombre: 'Conocimiento',
				routeName: 'configuration.headquarters',
				descripcion: 'Agrega conocimientos del negocio al Chatbot para entrenar sus respuestas con los leads.'
			}
		]
	},
	{
		id: 98,
		titulo: 'Plantillas',
		data: [
			{
				id: 56,
				foto: '/img/illustrations/chatbot.svg',
				nombre: 'Plantillas de Whatsapp',
				routeName: 'configuration.templates.whatsapp',
				descripcion: 'Descripción'
			},
		]
	},
]

/* Functions */
function toGoView(name) {
	router.push({ name })
}

</script>
