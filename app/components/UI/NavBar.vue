<template>
    <div class="flex w-full p-3 justify-between items-center shadow bg-green-200">
        <div class="font-bold">HairSaloon</div>
        <div>
            <USlideover side="top" title="Меню">
                <UButton icon="i-lucide-menu" color="neutral" variant="subtle" />

                <template #body>
                    <UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-full" />

                </template>
            </USlideover>
        </div>
    </div>
</template>
<script setup lang="ts">
const items = ref<NavigationMenuItem[][]>([
    [
        {
            label: "Главная",
            icon: "i-lucide-home",
            to: "/",
        },
        {
            label: "Календарь",
            icon: "i-lucide-calendar",
            to: "/calendar",
        },
        {
            label: "Клиенты",
            icon: "i-lucide-users",
            to: "/clients",
        },
        {
            label: "Расходы",
            icon: "i-lucide-coins",
            to: "/rashod",
        },
    ]
])
</script>