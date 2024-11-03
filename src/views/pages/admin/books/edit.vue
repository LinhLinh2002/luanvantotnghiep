<template>
    <div class="container">
        <h1>Cập Nhật Sách</h1>
        <form @submit.prevent="updateBook" class="book-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="title">Tiêu Đề:</label>
                    <input type="text" v-model="book.title" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="isbn">ISBN:</label>
                    <input type="text" v-model="book.isbn" class="form-control" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="author">Tác Giả:</label>
                    <select v-model="book.author_id" class="form-control" required>
                        <option v-for="author in authors" :key="author.id" :value="author.id">
                            {{ author.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="translator">Dịch Giả:</label>
                    <select v-model="book.translator_id" class="form-control">
                        <option v-for="translator in translators" :key="translator.id" :value="translator.id">
                            {{ translator.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="publisher">Nhà Xuất Bản:</label>
                    <select v-model="book.publisher_id" class="form-control" required>
                        <option v-for="publisher in publishers" :key="publisher.id" :value="publisher.id">
                            {{ publisher.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="co_publisher">Nhà Đồng Xuất Bản:</label>
                    <select v-model="book.co_publisher_id" class="form-control">
                        <option v-for="co_publisher in co_publishers" :key="co_publisher.id" :value="co_publisher.id">
                            {{ co_publisher.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="genre">Danh Mục:</label>
                    <select v-model="book.category_id" class="form-control" required>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="genre">Thể Loại:</label>
                    <select v-model="book.genre_id" class="form-control" required>
                        <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                            {{ genre.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="language">Ngôn Ngữ:</label>
                    <select v-model="book.language_id" class="form-control" required>
                        <option v-for="language in languages" :key="language.id" :value="language.id">
                            {{ language.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="cover_type">Loại Bìa:</label>
                    <select v-model="book.cover_type_id" class="form-control" required>
                        <option v-for="coverType in coverTypes" :key="coverType.id" :value="coverType.id">
                            {{ coverType.type }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="description">Mô Tả:</label>
                <textarea v-model="book.description" class="form-control" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="quantity">Số Lượng:</label>
                    <input type="number" v-model="book.quantity" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="original_price">Giá Gốc:</label>
                    <input type="number" v-model="book.original_price" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="discount_price">Giá Khuyến Mãi:</label>
                    <input type="number" v-model="book.discount_price" class="form-control" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="published_year">Năm Xuất Bản:</label>
                    <input type="number" v-model="book.published_year" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="number_pages">Số Trang:</label>
                    <input type="number" v-model="book.number_pages" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="size">Kích Thước:</label>
                    <input type="text" v-model="book.size" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="weight">Trọng Lượng:</label>
                    <input type="number" v-model="book.weight" step="0.01" class="form-control" required />
                </div>
            </div>
            <div class="form-group">
                <label for="image">Hình Ảnh:</label>
                <input type="file" @change="onFileChange" class="form-control" />
                <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="img-preview" />
            </div>

            <button type="submit" class="btn btn-primary">Cập Nhật Sách</button>
        </form>
    </div>
</template>

<script setup>
import AttributeService from '@/service/AttributeService';
import AuthorService from '@/service/AuthorService';
import BookService from '@/service/BookService';
import CategoryService from '@/service/CategoryService';
import CoPublisherService from '@/service/CoPublisherService';
import PublisherService from '@/service/PublisherService';
import TranslatorService from '@/service/TranslatorService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const book = ref({});
const imagePreview = ref(null);
const authors = ref([]);
const publishers = ref([]);
const co_publishers = ref([]);
const translators = ref([]);
const genres = ref([]);
const categories = ref([]);
const coverTypes = ref([]);
const languages = ref([]);

const fetchBook = async (id) => {
    try {
        const response = await BookService.getBookById(id);
        Object.assign(book.value, response.data);
        imagePreview.value = response.data.image;
    } catch (error) {
        alert('Lỗi khi tải thông tin sách: ' + error.message);
    }
};
const updateBook = async () => {
    const payload = {
        title: book.value.title,
        isbn: book.value.isbn,
        publisher_id: book.value.publisher_id,
        co_publisher_id: book.value.co_publisher_id,
        translator_id: book.value.translator_id,
        author_id: book.value.author_id,
        category_id: book.value.category_id,
        cover_type_id: book.value.cover_type_id,
        genre_id: book.value.genre_id,
        language_id: book.value.language_id,
        description: book.value.description,
        quantity: book.value.quantity,
        original_price: book.value.original_price,
        discount_price: book.value.discount_price,
        published_year: book.value.published_year,
        number_pages: book.value.number_pages,
        size: book.value.size,
        weight: book.value.weight,
        status: book.value.status,
    };

    if (book.value.image instanceof File) {
        payload.image = book.value.image;
    }
    try {
        await BookService.updateBook(book.value.id, payload);
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sách thành công!', life: 3000 });
        router.push('/books');
    } catch (error) {
        if (error.response) {
            console.error('Lỗi dữ liệu:', error.response.data);
            alert('Lỗi khi cập nhật sách: ' + JSON.stringify(error.response.data));
        } else {
            alert('Lỗi không xác định: ' + error.message);
        }
    }
};



const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        book.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const fetchAuthors = async () => {
    // Fetch authors data
    try {
        const response = await AuthorService.getAllAuthors();
        authors.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách tác giả: ' + error.message);
    }
};

const fetchPublishers = async () => {
    // Fetch publishers data
    try {
        const response = await PublisherService.getAllPublishers();
        publishers.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách nhà xuất bản: ' + error.message);
    }
};

const fetchCoPublishers = async () => {
    try {
        const response = await CoPublisherService.getAllCoPublishers();
        co_publishers.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách đồng nhà xuất bản: ' + error.message);
    }
};

const fetchTranslators = async () => {
    try {
        const response = await TranslatorService.getAllTranslators();
        translators.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách dịch giả: ' + error.message);
    }
};

const fetchGenres = async () => {
    try {
        const response = await AttributeService.getAllGenres();
        genres.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách thể loại: ' + error.message);
    }
};

const fetchCategories = async () => {
    try {
        const response = await CategoryService.getAllCategories();
        categories.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách danh mục: ' + error.message);
    }
};

const fetchCoverTypes = async () => {
    try {
        const response = await AttributeService.getAllCoverTypes();
        coverTypes.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách loại bìa: ' + error.message);
    }
};

const fetchLanguages = async () => {
    try {
        const response = await AttributeService.getAllLanguages();
        languages.value = response.data;
    } catch (error) {
        alert('Lỗi khi tải danh sách ngôn ngữ: ' + error.message);
    }
};

onMounted(() => {
    const bookId = router.currentRoute.value.params.id;
    fetchBook(bookId);
    fetchAuthors();
    fetchPublishers();
    fetchCoPublishers();
    fetchTranslators();
    fetchGenres();
    fetchCategories();
    fetchCoverTypes();
    fetchLanguages();
});
</script>

<style scoped>
.container {
    max-width: 100%;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.book-form {
    display: grid;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.form-control {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
}

.form-row {
    display: flex;
    justify-content: space-between;
}

.btn {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn:hover {
    background-color: #0056b3;
}

.img-preview {
    margin-top: 10px;
    max-width: 10%;
    height: auto;
}
</style>
