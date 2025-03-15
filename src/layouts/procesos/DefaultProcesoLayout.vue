<template>
    <div class="card">

        <Tabs value="/app/operacion/lavado" class="overflow-x-auto md:overflow-x-visible">
            <TabList class="flex-nowrap md:flex-wrap">
                <Tab v-for="tab in items" :key="tab.label" :value="tab.route" class="p-2">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                            <i :class="tab.icon" />
                            <span>{{ tab.label }}</span>
                        </a>
                    </router-link>
                </Tab>
            </TabList>
        </Tabs>

        <router-view />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const items = ref([
    { route: '/app/operacion/lavado', label: 'Lavado', icon: 'mdi mdi-washing-machine' },
    { route: '/app/operacion/secado', label: 'Secado', icon: 'mdi mdi-weather-sunny' },
    { route: '/app/operacion/doblado', label: 'Doblado', icon: 'mdi mdi-format-wrap-tight' },
    { route: '/app/operacion/tenido', label: 'Teñido', icon: 'mdi mdi-palette' },
    { route: '/app/operacion/planchado', label: 'Planchado', icon: 'mdi mdi-iron' },
]);
</script>
