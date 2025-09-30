// --- ОСНОВНІ ФУНКЦІЇ СТОРІНКИ ---

function showConsultationForm() {
    document.getElementById('consultationModal').classList.remove('hidden');
    feather.replace();
}

function hideConsultationForm() {
    document.getElementById('consultationModal').classList.add('hidden');
}

document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        feather.replace();
    } else {
        menu.classList.add('hidden');
    }
});

// --- ЛОГІКА РОБОТИ З ВІДГУКАМИ ---

const feedbackForm = document.getElementById('feedbackForm');
const testimonialsGrid = document.getElementById('testimonials-grid');
let currentRating = 0; // Змінна для зберігання поточної оцінки

// Функція для створення HTML-коду зірок
function createStarsHtml(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        const isFilled = i < rating ? 'fill-amber-400' : '';
        starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star text-amber-400 ${isFilled}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
    return `<div class="flex">${starsHtml}</div>`;
}

// Функція для відображення одного відгуку
function renderTestimonial(testimonial) {
    const testimonialEl = document.createElement('div');
    testimonialEl.className = 'bg-gray-800 rounded-xl p-6 border border-gray-700';
    
    testimonialEl.innerHTML = `
        <div class="flex items-center mb-4">
            <img src="http://static.photos/people/200x200/${Math.floor(Math.random() * 10) + 1}" alt="Client" class="w-12 h-12 rounded-full mr-4">
            <div>
                <h4 class="font-bold">${testimonial.name}</h4>
                ${createStarsHtml(testimonial.rating)}
            </div>
        </div>
        <p class="text-gray-300">"${testimonial.text}"</p>
    `;
    testimonialsGrid.appendChild(testimonialEl);
}

// Обробник відправки форми
if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Забороняємо сторінці перезавантажуватися

        // Збираємо дані з полів
        const nameInput = event.target.querySelector('input[type="text"]');
        const textInput = event.target.querySelector('textarea');
        
        const name = nameInput ? nameInput.value : 'Анонім';
        const text = textInput ? textInput.value : '';
        
        if (!name || !text || currentRating === 0) {
            alert('Будь ласка, заповніть усі поля та поставте оцінку.');
            return;
        }

        const newTestimonial = { name, text, rating: currentRating };

        // Зберігаємо в localStorage
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.push(newTestimonial);
        localStorage.setItem('reviews', JSON.stringify(reviews));

        // Відображаємо новий відгук на сторінці
        renderTestimonial(newTestimonial);

        // Очищаємо форму
        event.target.reset();
        setRating(0);
        currentRating = 0;
    });
}

// Завантажуємо і відображаємо всі збережені відгуки при завантаженні сторінки
window.addEventListener('load', () => {
    if (testimonialsGrid) {
        const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
        savedReviews.forEach(review => renderTestimonial(review));
    }
});


// --- СИСТЕМА РЕЙТИНГУ ---
function setRating(ratingValue) {
    currentRating = ratingValue; // Зберігаємо оцінку
    const starSvgs = document.querySelectorAll('#rating-stars svg');
    starSvgs.forEach((svg, index) => {
        svg.classList.toggle('fill-amber-400', index < ratingValue);
    });
}

// --- ЗАПУСК СКРИПТІВ ---
feather.replace(); // Первинна заміна іконок

const clickableStars = document.querySelectorAll('#rating-stars svg');
clickableStars.forEach((star, index) => {
    star.addEventListener('click', () => {
        setRating(index + 1);
    });
});