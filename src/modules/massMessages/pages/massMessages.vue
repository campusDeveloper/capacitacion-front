<template>
	<section class="vstack overflow-hidden h-full">
		<Navbar name="Mensajes masivos" />
		<el-scrollbar view-class="p-8">
			<router-view />
		</el-scrollbar>
	</section>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

/* Functions */

</script>