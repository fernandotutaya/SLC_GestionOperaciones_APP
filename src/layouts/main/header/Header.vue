<script lang="ts" setup>
import { ref, onMounted } from "vue";
import UtilBtns from "./UtilBtns.vue";
import User from "./User.vue";
import Sidebar from "../sidebar/Sidebar.vue";

const isMobile = ref(false);

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});
</script>
<template>
    <div class="card w-full text-center mt-2">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <Sidebar />
            <div class="flex flex-1 justify-center md:justify-end">
                <input
                    type="text"
                    placeholder="Buscar..."
                    class="border rounded-md py-2 px-4 w-full md:w-1/3"
                />
            </div>
            <UtilBtns v-if="!isMobile" />
            <User />
        </div>
        <hr class="w-full border-t-2 border-surface-100 my-2 shadow-md" />
    </div>
</template>