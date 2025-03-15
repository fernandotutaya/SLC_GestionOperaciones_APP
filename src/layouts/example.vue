<template>
    <div class="card">
        <DataTable
            v-model:editingRows="editingRows"
            :value="products"
            editMode="row"
            dataKey="id"
            @row-edit-save="onRowEditSave"
            :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }: any) => ({
                        style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem',
                    }),
                },
            }"
        >
            <Column field="code" header="Code" style="width: 20%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="name" header="Name" style="width: 20%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="inventoryStatus" header="Status" style="width: 20%">
                <template #editor="{ data, field }">
                    <Select
                        v-model="data[field]"
                        :options="statuses"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select a Status"
                        fluid
                    >
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.value" :severity="getStatusLabel(slotProps.option.value)" />
                        </template>
                    </Select>
                </template>
                <template #body="slotProps">
                    <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
                </template>
            </Column>
            <Column field="price" header="Price" style="width: 20%">
                <template #body="{ data, field }">
                    {{ formatCurrency(data[field]) }}
                </template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" fluid />
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';

// Define types for the product and status objects
export interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
    orders?: Order[];
}

export interface Order {
    id: string;
    productCode: string;
    date: string;
    amount: number;
    quantity: number;
    customer: string;
    status: string;
}

interface Status {
    label: string;
    value: string;
}

const products = ref<Product[] | null>(null);
const editingRows = ref<{ [key: string]: boolean }>({});
const statuses = ref<Status[]>([
    { label: 'In Stock', value: 'INSTOCK' },
    { label: 'Low Stock', value: 'LOWSTOCK' },
    { label: 'Out of Stock', value: 'OUTOFSTOCK' },
]);

// Fetch products on component mount
onMounted(() => {
    ProductService.getProductsMini().then((data: Product[]) => (products.value = data));
});

// Handle row edit save
const onRowEditSave = (event: { newData: Product; index: number }) => {
    if (products.value) {
        products.value[event.index] = event.newData;
    }
};

// Get label for inventory status
const getStatusLabel = (status: string): 'success' | 'warn' | 'danger' | 'secondary' => {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warn';
        case 'OUTOFSTOCK':
            return 'danger';
        default:
            return 'secondary';
    }
};

// Format price as currency
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>
