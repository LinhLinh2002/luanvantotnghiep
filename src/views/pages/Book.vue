<script setup>
import { BookService } from '@/service/BookService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    BookService.getBooks().then((data) => (books.value = data.data)); // Lấy danh sách sách từ API
});

const toast = useToast();
const dt = ref();
const books = ref();
const bookDialog = ref(false);
const deleteBookDialog = ref(false);
const deleteBooksDialog = ref(false);
const book = ref({});
const selectedBooks = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew() {
    book.value = {};
    submitted.value = false;
    bookDialog.value = true;
}

function hideDialog() {
    bookDialog.value = false;
    submitted.value = false;
}

function saveBook() {
    submitted.value = true;

    if (book?.value.title?.trim()) {
        if (book.value.id) {
            books.value[findIndexById(book.value.id)] = book.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Book Updated', life: 3000 });
        } else {
            book.value.id = createId();
            books.value.push(book.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Book Created', life: 3000 });
        }

        bookDialog.value = false;
        book.value = {};
    }
}

function editBook(bk) {
    book.value = { ...bk };
    bookDialog.value = true;
}

function confirmDeleteBook(bk) {
    book.value = bk;
    deleteBookDialog.value = true;
}

function deleteBook() {
    books.value = books.value.filter((val) => val.id !== book.value.id);
    deleteBookDialog.value = false;
    book.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Book Deleted', life: 3000 });
}

function findIndexById(id) {
    return books.value.findIndex(b => b.id === id);
}

function createId() {
    return Math.random().toString(36).substr(2, 9);
}

function confirmDeleteSelected() {
    deleteBooksDialog.value = true;
}

function deleteSelectedBooks() {
    books.value = books.value.filter((val) => !selectedBooks.value.includes(val));
    deleteBooksDialog.value = false;
    selectedBooks.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Books Deleted', life: 3000 });
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedBooks || !selectedBooks.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedBooks"
                :value="books"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} books"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Books</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="title" header="Title" sortable style="min-width: 16rem"></Column>
                <Column field="isbn" header="ISBN" sortable style="min-width: 12rem"></Column>
                <Column field="publisher_id" header="Publisher" sortable style="min-width: 12rem"></Column>
                <Column field="author_id" header="Author" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editBook(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteBook(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="bookDialog" :style="{ width: '450px' }" header="Book Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="title" class="block font-bold mb-3">Title</label>
                    <InputText id="title" v-model.trim="book.title" required="true" autofocus :invalid="submitted && !book.title" fluid />
                    <small v-if="submitted && !book.title" class="text-red-500">Title is required.</small>
                </div>
                <div>
                    <label for="isbn" class="block font-bold mb-3">ISBN</label>
                    <InputText id="isbn" v-model="book.isbn" required="true" fluid />
                </div>
                <div>
                    <label for="publisher_id" class="block font-bold mb-3">Publisher</label>
                    <InputNumber id="publisher_id" v-model="book.publisher_id" integeronly fluid />
                </div>
                <div>
                    <label for="author_id" class="block font-bold mb-3">Author</label>
                    <InputNumber id="author_id" v-model="book.author_id" integeronly fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveBook" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteBookDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="book"
                    >Are you sure you want to delete <b>{{ book.title }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBookDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteBook" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteBooksDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="book">Are you sure you want to delete the selected books?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBooksDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedBooks" />
            </template>
        </Dialog>
    </div>
</template>
