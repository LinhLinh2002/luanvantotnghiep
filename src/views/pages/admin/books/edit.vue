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
                    <label for="authors">Tác Giả:</label>
                    <div class="dropdown">
                        <button class="dropdown-toggle" @click.stop="toggleDropdown">
                            Chọn Tác Giả
                            <span class="caret"></span>
                        </button>
                        <div v-if="isDropdownOpen" class="dropdown-menu" @click.stop>
                            <div v-for="author in authors" :key="author.id" class="dropdown-item">
                                <label>
                                    <input type="checkbox" :value="author.id" v-model="book.authors" />
                                    {{ author.name }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <p>Đã chọn: {{ selectedAuthors }}</p>
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
                <input type="file" @change="onFileChange" class="form-control" />
                <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="img-preview" />
            </div>

            <button type="submit" class="btn btn-primary">Cập Nhật Sách</button>
        </form>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Import useRouter correctly
import AttributeService from '@/service/AttributeService';
import AuthorService from '@/service/AuthorService';
import BookService from '@/service/BookService';
import CategoryService from '@/service/CategoryService';
import PublisherService from '@/service/PublisherService';
import TranslatorService from '@/service/TranslatorService';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const isDropdownOpen = ref(false); // Trạng thái của dropdown

const router = useRouter();
const toast = useToast();
const book = ref({});
const imagePreview = ref(null);
const authors = ref([]);
const publishers = ref([]);
const translators = ref([]);
const genres = ref([]);
const categories = ref([]);
const coverTypes = ref([]);
const languages = ref([]);

const fetchBook = async (id) => {
    try {
        const response = await BookService.getBookById(id);
        const bookData = response.data;

        // Nếu API trả về danh sách authors dưới dạng object, map thành array các ID
        if (Array.isArray(bookData.authors) && bookData.authors.length > 0 && typeof bookData.authors[0] === 'object') {
            bookData.authors = bookData.authors.map((author) => author.id);
        }

        Object.assign(book.value, bookData);
        // Kiểm tra các trường length, width, height
        book.value.length = response.data.length || '';
        book.value.width = response.data.width || '';
        book.value.height = response.data.height || '';
        imagePreview.value = bookData.image;
    } catch (error) {
        alert('Lỗi khi tải thông tin sách: ' + error.message);
    }
};
const updateBook = async () => {
    const payload = {
        title: book.value.title,
        isbn: book.value.isbn,
        publisher_id: book.value.publisher_id,
        translator_id: book.value.translator_id,
        authors: book.value.authors, // Phải là một mảng các ID tác giả
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
        length: book.value.length,
        width: book.value.width,
        height: book.value.height,
        weight: book.value.weight,
        status: book.value.status,
    };

    if (book.value.image instanceof File) {
        payload.image = book.value.image;
    }

    console.log('Payload:', payload);

    try {
        await BookService.updateBook(book.value.id, payload);
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sách thành công!', life: 3000 });
        router.push('/books');
    } catch (error) {
        console.error('Lỗi khi cập nhật sách:', error.response ? error.response.data : error.message);
        alert('Lỗi khi cập nhật sách: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
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
const toggleDropdown = (event) => {
    event.stopPropagation(); // Ngăn không cho sự kiện click bên ngoài đóng ngay lập tức
    isDropdownOpen.value = !isDropdownOpen.value;
};
const selectedAuthors = computed(() => {
    return authors.value
        .filter((author) => book.value.authors?.includes(author.id))
        .map((author) => author.name)
        .join(', ');
});
const handleClickOutside = (event) => {
    // Kiểm tra xem sự kiện click có xảy ra ngoài dropdown không
    if (!event.target.closest('.dropdown')) {
        isDropdownOpen.value = false;
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
    fetchTranslators();
    fetchGenres();
    fetchCategories();
    fetchCoverTypes();
    fetchLanguages();
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
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

.dropdown {
    position: relative;
    width: 100%;
}

.dropdown-toggle {
    width: 100%;
    padding: 10px;
    background-color: #f8f9fa;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
}

.dropdown-menu {
    display: block;
    /* Đảm bảo hiển thị */
    position: absolute;
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.dropdown-item {
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.dropdown-item label {
    margin: 0;
    cursor: pointer;
}

.dropdown-item input[type="checkbox"] {
    cursor: pointer;
}

.caret {
    float: right;
    margin-top: 5px;
    border-top: 5px solid #333;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
}

.dropdown-toggle:hover {
    background-color: #e9ecef;
}

.dropdown-menu::-webkit-scrollbar {
    width: 6px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
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