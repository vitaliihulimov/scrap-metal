/* Перегляди */
fetch('counter.php')
    .then(response => response.text())
    .then(data => {
        document.getElementById('viewCount').textContent = data;
    });

/* Поточна дата */

function updateDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('uk-UA', options);
    document.getElementById('current-date').textContent = formattedDate;
}
updateDate();

/* Калькулятор ціни металобрухту */

const priceMap = {
    Мідь: { price: 371, waste: 1 },
    Латунь: { price: 236, waste: 1 },
    'Радіатор латунний': { price: 236, waste: 2 },
    'Алюміній побутовий': { price: 64, waste: 1 },
    'Алюміній електротехнічний': { price: 92, waste: 1 },
    'Нержавіюча сталь': { price: 42, waste: 0.5 },
    'Нержавіюча сталь (8% нікелю)': { price: 32, waste: 0.5 },
    Магній: { price: 33, waste: 3 },
    'ЦАМ (цинк-алюміній-магній)': { price: 59, waste: 3 },
    'Стружка мідна': { price: 329, waste: 1 },
    'Стружка латунна': { price: 228, waste: 3 },
    Свинець: { price: 64, waste: 1 },
    'Свинець кабельний': { price: 66, waste: 1 },
    'Акумулятор білий': { price: 20, waste: 1 },
    'Акумулятор чорний': { price: 16, waste: 1 },
    'ТНЖ великі': { price: 18, waste: 3 },
    'ТНЖ маленькі': { price: 16, waste: 3 },
    Титан: { price: 80, waste: 0.5 },
    'Високолегована сталь 18-99% Ni': { price: 4000, waste: 0 },
    'Чорний металобрухт': { price: 5, waste: 0 },
};

const cart = [];

function renderCart() {
    const tbody = document.querySelector('#cart-table tbody');
    tbody.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let cleanedPrice = item.basePrice - (item.basePrice * item.waste) / 100;
        let itemTotal;

        if (item.metal === 'Чорний металобрухт') {
            // Віднімання 3% + округлення вниз до 0.1 (десяткове)
            cleanedPrice = Math.floor(cleanedPrice * 10) / 10;
            itemTotal = cleanedPrice * item.weight;
            itemTotal = Math.round(itemTotal); // Округлення загальної суми до цілого
        } else {
            // Для інших металів - округлення вниз до цілого
            cleanedPrice = Math.floor(cleanedPrice);
            itemTotal = cleanedPrice * item.weight;
        }

        totalPrice += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${item.metal}</td>
        <td>${Math.round(item.weight)}</td>
        <td>${item.basePrice} грн</td>
        <td>${item.waste}%</td>
        <td>${itemTotal}</td>
        <td><button data-index="${index}" class="remove-btn">✖</button></td>
      `;
        tbody.appendChild(row);
    });

    document.getElementById('total-price').textContent = totalPrice;

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', e => {
            const index = +e.target.getAttribute('data-index');
            cart.splice(index, 1);
            renderCart();
        });
    });
}

document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    const metal = document.getElementById('metal-type').value;
    const weight = parseFloat(document.getElementById('weight').value);

    if (!metal) return alert('Оберіть метал.');
    if (isNaN(weight) || weight <= 0) return alert('Введіть правильну вагу.');

    const { price, waste } = priceMap[metal];

    const existing = cart.find(item => item.metal === metal);
    if (existing) {
        existing.weight += weight;
    } else {
        cart.push({
            metal,
            weight,
            basePrice: price,
            waste: waste,
        });
    }

    document.getElementById('weight').value = '';
    document.getElementById('metal-type').value = '';
    renderCart();
});

document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (confirm('Очистити кошик?')) {
        cart.length = 0;
        renderCart();
    }
});

/* Бургер меню */

const burger = document.getElementById('burger-btn');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

burger.addEventListener('click', () => {
    navList.classList.toggle('active');
    burger.classList.toggle('open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        burger.classList.remove('open');
    });
});

/* Анімації при скролі */
const scrollToTopBtn = document.querySelector('.scroll-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});

/* Ціни на метали в таблиці */
const prices = [
    { name: 'Мідь', junk: '-1%', current: 371, previous: 367 },
    { name: 'Латунь', junk: '-1%', current: 236, previous: 236 },
    { name: 'Радіатор латунний', junk: '-2%', current: 236, previous: 235 },
    { name: 'Алюміній побутовий', junk: '-1%', current: 64, previous: 64 },
    {
        name: 'Алюміній електротехнічний',
        junk: '-1%',
        current: 92,
        previous: 92,
    },
    { name: 'Нержавіюча сталь', junk: '-0,5%', current: 42, previous: 42 },
    {
        name: 'Нержавіюча сталь (8% нікелю)',
        junk: '-0,5%',
        current: 32,
        previous: 32,
    },
    { name: 'Магній', junk: '-3%', current: 33, previous: 33 },
    {
        name: 'ЦАМ (цинк-алюміній-магній)',
        junk: '-3%',
        current: 59,
        previous: 59,
    },
    { name: 'Стружка мідна', junk: '-1%', current: 329, previous: 329 },
    { name: 'Стружка латунна', junk: '-1%', current: 228, previous: 228 },
    { name: 'Свинець', junk: '-1%', current: 64, previous: 64 },
    { name: 'Свинець кабельний', junk: '-1%', current: 66, previous: 66 },
    { name: 'Акумулятор білий', junk: '-1%', current: 20, previous: 23 },
    { name: 'Акумулятор чорний', junk: '-1%', current: 16, previous: 17 },
    { name: 'ТНЖ великі', junk: '-3%', current: 18, previous: 20 },
    { name: 'ТНЖ маленькі', junk: '-3%', current: 16, previous: 18 },
    { name: 'Титан', junk: '-0.5%', current: 80, previous: 82 },
    {
        name: 'Високолегована сталь 18-99% Ni',
        junk: '0%',
        current: 4000,
        previous: 4100,
    },
    { name: 'Чорний металобрухт', junk: '0%', current: 5, previous: 5 },
];

function renderPrices() {
    const container = document.getElementById('dynamic-prices');
    const table = document.createElement('table');

    // Заголовки
    const thead = document.createElement('thead');
    thead.innerHTML = `
    <tr>
      <th>Найменування металобрухту</th>
      <th>Засмічення</th>
      <th>Ціна за кг, грн</th>
    </tr>
  `;

    const tbody = document.createElement('tbody');

    prices.forEach(item => {
        let indicator = '➖';
        let indicatorClass = '';

        if (item.current > item.previous) {
            indicator = '▲';
            indicatorClass = 'blink-green';
        } else if (item.current < item.previous) {
            indicator = '▼';
            indicatorClass = 'blink-red';
        }


        const row = document.createElement('tr');
        row.classList.add('price-row'); // ← ДОДАЛИ
        row.innerHTML = `
  <td class="metal-name" data-metal="${item.name}">${item.name}</td>
  <td>${item.junk}</td>
  <td>${item.current} <span class="${indicatorClass}">${indicator}</span></td>
`;
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    // Intersection Observer — спрацювання stagger при скролі
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Стагер по черзі
                    const rows = table.querySelectorAll('tbody tr');
                    rows.forEach((row, index) => {
                        setTimeout(() => row.classList.add('show'), index * 100);
                    });
                    observer.unobserve(entry.target); // більше не спрацьовує
                }
            });
        },
        { threshold: 0.2 }
    ); // спрацьовує, коли 20% таблиці видно

    observer.observe(table);
}

renderPrices();

/* Анімації при скролі для інших секцій */
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2,
    }
);

document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
});

/* Друкарський ефект */
const typeElements = document.querySelectorAll('.typewriter');

const observers = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            observers.unobserve(el);

            const text = el.textContent.trim();
            el.textContent = '';
            el.classList.add('show');

            let index = 0;
            const speed = 45;

            const type = () => {
                if (index < text.length) {
                    el.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    el.classList.add('done'); // ⬅ прибираємо курсор
                }
            };

            type();
        });
    },
    { threshold: 0.6 }
);

typeElements.forEach(el => observers.observe(el));

/* Сніг */
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const numFlakes = 50; // менше сніжинок
const flakes = [];
const ground = []; // для накопичення сніжинок внизу

for (let i = 0; i < numFlakes; i++) {
    flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1, // радіус сніжинки
        d: Math.random() * numFlakes,
        tilt: Math.random() * 10,
        tiltAngleIncremental: Math.random() * 0.05 + 0.01,
        speed: Math.random() * 1 + 0.5,
    });
}

// малюємо сніг
function drawSnow() {
    ctx.clearRect(0, 0, width, height);

    // малюємо падаючі сніжинки
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    ctx.fill();

    // малюємо сніг на «землі»
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ground.forEach(g => {
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
    });

    updateSnow();
}

// оновлення позицій
function updateSnow() {
    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.tilt += f.tiltAngleIncremental;
        f.y += f.speed;
        f.x += Math.sin(f.tilt) * 1.5;

        // якщо сніжинка досягла низу
        if (f.y + f.r >= height - 2) {
            ground.push({ x: f.x, y: height - f.r, r: f.r });
            resetFlake(f);
        }

        // якщо сніжинка виходить за бічні межі
        if (f.x > width) f.x = width;
        if (f.x < 0) f.x = 0;
    }

    requestAnimationFrame(drawSnow);
}

// скидання сніжинки наверх
function resetFlake(f) {
    f.x = Math.random() * width;
    f.y = -10;
    f.r = Math.random() * 4 + 1;
    f.speed = Math.random() * 1 + 0.5;
    f.tilt = Math.random() * 10;
}

// адаптація під розмір вікна
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

drawSnow();


const metalDescriptions = {
    'Мідь': 'Вироби з чистої міді без ізоляції: дроти, труби, листи, деталі.',
    'Латунь': 'Вироби з чистої латуні: труби, деталі, сантехнічні елементи.',
    'Радіатор латунний': 'Латунні радіатори та їхні частини без домішок інших металів.',
    'Алюміній побутовий': 'Посуд, профілі, листовий алюміній.',
    'Алюміній електротехнічний': 'Кабелі та провідники високої чистоти.',
    'Нержавіюча сталь': 'Нержавійка з вмістом нікелю 10%.',
    'Нержавіюча сталь (8% нікелю)': 'Нержавійка з вмістом нікелю 8%',
    'Магній': 'Надзвичайно легкий, ковкий метал сріблясто-білого кольору, який широко використовується як у промисловості для створення легких і міцних сплавів.',
    'ЦАМ (цинк-алюміній-магній)': 'Литі деталі, автомеханізми.',
    'Стружка мідна': 'Відходи після обробки міді.',
    'Стружка латунна': 'Відходи після обробки латуні.',
    'Свинець': 'Вироби зі свинцю.',
    'Свинець кабельний': 'Кабельний свинець без домішок.',
    'Акумулятор білий': 'Білі акумулятори від авто та техніки, приймаються цілі або пошкоджені.',
    'Акумулятор чорний': 'Чорні акумулятори.',
    'ТНЖ великі': 'Тверді немагнітні жаростійкі сплави.',
    'ТНЖ маленькі': 'Малі деталі ТНЖ.',
    'Титан': 'Легкий і міцний метал.',
    'Високолегована сталь 18-99% Ni': 'Нікелеві сплави високої вартості.',
    'Чорний металобрухт': 'Залізо, сталь.'
};

const modal = document.getElementById('metal-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalJunk = document.getElementById('modal-junk');

document.addEventListener('click', e => {
    const metalCell = e.target.closest('.metal-name');
    if (!metalCell) return;

    const metal = metalCell.dataset.metal;
    const priceItem = prices.find(p => p.name === metal);

    modalTitle.textContent = metal;
    modalDesc.textContent = metalDescriptions[metal] || 'Опис відсутній';
    modalPrice.textContent = priceItem.current;
    modalJunk.textContent = priceItem.junk;

    modal.classList.add('show');
});

document.querySelector('.modal-close').onclick = () =>
    modal.classList.remove('show');

modal.onclick = e => {
    if (e.target === modal) modal.classList.remove('show');
};


const list = document.querySelector('.advantage-list');
const inner = list.querySelector('.inner');

list.addEventListener('mousemove', (e) => {
    const rect = list.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = ((y / rect.height) - 0.5) * -14;

    inner.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `;
});

list.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
});
