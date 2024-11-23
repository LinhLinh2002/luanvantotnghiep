<template>
    <div class="container">
        <h1>Thêm Sách Mới</h1>
        <form @submit.prevent="createBook" class="book-form">
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
                    <label for="size">Length:</label>
                    <input type="text" v-model="book.length" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="size">Width:</label>
                    <input type="text" v-model="book.width" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="size">Height:</label>
                    <input type="text" v-model="book.height" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="weight">Trọng Lượng:</label>
                    <input type="number" v-model="book.weight" step="0.01" class="form-control" required />
                </div>
            </div>
            <div class="form-group">
                <label for="image">Hình Ảnh:</label>
                <input type="file" @change="onFileChange" class="form-control" required />
                <img v-if="book.image" :src="imagePreview" alt="Preview" class="img-preview" />
            </div>

            <button type="submit" class="btn btn-primary">Thêm Sách</button>
        </form>
    </div>
</template>

<script setup>
import router from '@/router';
import AttributeService from '@/service/AttributeService';
import AuthorService from '@/service/AuthorService';
import BookService from '@/service/BookService';
import CategoryService from '@/service/CategoryService';
import CoPublisherService from '@/service/CoPublisherService';
import PublisherService from '@/service/PublisherService';
import TranslatorService from '@/service/TranslatorService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';


const authors = ref([]);
const publishers = ref([]);
const co_publishers = ref([]);
const translators = ref([]);
const genres = ref([]);
const categories = ref([]);
const coverTypes = ref([]);
const toast = useToast();
const languages = ref([]);
const imagePreview = ref(null);
const book = ref({
    title: '',
    isbn: '',
    author_id: null,
    publisher_id: null,
    category_id: null,
    co_publisher_id: null,
    translator_id: null,
    genre_id: null,
    cover_type_id: null,
    language_id: null,
    image: null,
    description: '',
    quantity: 0,
    original_price: 0,
    discount_price: null,
    published_year: null,
    number_pages: 0,
    length: '',
    width: '',
    height: '',
    status: 'instock',
    weight: 0,
});

const fetchAuthors = async () => {
    try {
        const response = await AuthorService.getAllAuthors();
        authors.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách tác giả: ' + error.message);
    }
};

const fetchPublishers = async () => {
    try {
        const response = await PublisherService.getAllPublishers();
        publishers.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách nhà xuất bản: ' + error.message);
    }
};

const fetchCoPublishers = async () => {
    try {
        const response = await CoPublisherService.getAllCoPublishers();
        co_publishers.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách đồng nhà xuất bản: ' + error.message);
    }
};

const fetchTranslator = async () => {
    try {
        const response = await TranslatorService.getAllTranslators();
        translators.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách dịch giả: ' + error.message);
    }
};
const fetchCategory = async () => {
    try {
        const response = await CategoryService.getAllCategories();
        categories.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách dịch giả: ' + error.message);
    }
};

const fetchGenres = async () => {
    try {
        const response = await AttributeService.getAllGenres();
        genres.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách thể loại: ' + error.message);
    }
};

const fetchCoverTypes = async () => {
    try {
        const response = await AttributeService.getAllCoverTypes();
        coverTypes.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách loại bìa: ' + error.message);
    }
};

const fetchLanguages = async () => {
    try {
        const response = await AttributeService.getAllLanguages();
        languages.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách ngôn ngữ: ' + error.message);
    }
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        book.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const createBook = async () => {
    const formData = new FormData();
    
    for (const key in book.value) {
        if (book.value[key] !== null && book.value[key] !== '') {
            formData.append(key, book.value[key]);
        }
    }
    try {
        await BookService.createBook(formData);
        showToast('Thêm sách thành công!');
        router.push('/books')
        resetForm();
    } catch (error) {
        alert('Lỗi khi thêm sách: ' + error.message);
    }
};

const resetForm = () => {
    for (const key in book.value) {
        book.value[key] = null;
    }
    imagePreview.value = null; // Reset đường dẫn hình ảnh
};
const showToast = (detail) => {
    toast.add({ severity: 'success', summary: 'Thành công', detail, life: 3000 });
};

onMounted(() => {
    fetchAuthors();
    fetchCategory();
    fetchPublishers();
    fetchCoPublishers();
    fetchTranslator();
    fetchGenres();
    fetchCoverTypes();
    fetchLanguages();
});
</script>

<style scoped>
.container {
    max-width: 100%;
    /* Đặt chiều rộng tối đa là 100% */
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
    margin-right: 10px;
}

.form-control {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
}

.form-row {
    display: flex;
    /* Sử dụng flexbox để sắp xếp các trường */
    justify-content: space-between;
    /* Căn giữa các trường */
}

.form-group:last-child {
    margin-right: 0;
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