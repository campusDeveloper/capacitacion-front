<template>
  <SideMenuGeneral :menus="menus" :withDeploy="withDeploy" classMenu="max-w-[232px] overflow-hidden"
    widthPopover="max-w-[203px]">
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </SideMenuGeneral>
</template>

<script setup>
import { computed } from 'vue';
import SideMenuGeneral from './SideMenuGeneral.vue';



const props = defineProps({
  withDeploy: {
    type: Boolean,
    default: false
  },
})

const allMenus = [
  [
    { name: 'Dashboard', route: 'dashboard', icon: 'icon-category' },
    { name: 'Seguimiento leads', route: 'tracking.leads', icon: 'icon-search-favorite', module: 2 },
    { name: 'Pre-reservas', route: 'preReservation', icon: 'icon-calendar-tick', module: 3 },
    { name: 'Chats', route: 'chats', icon: 'icon-messages', module: 4 },
    { name: 'Clientes', route: 'clients', icon: 'icon-book', module: 1 },
    { name: 'Mensajes masivos', route: 'massMessages', icon: 'icon-send', module: 5 },
    { name: 'Usuarios', route: 'users', icon: 'icon-user', module: 6 },
    { name: 'Configuración', route: 'configuration', icon: 'icon-setting-2', module: 7 }
  ]
];

const menus = computed(() => {

  return allMenus
});

</script>