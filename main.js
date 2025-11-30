const allEmojis = [
    "🍎", "🍌", "🍒", "🍇", "🍉", "🍓", "🍑", "🍈", "🍍", "🥥", 
    "🥝", "🍅", "🍆", "🥑", "🥦", "🥒", "🌶", "🌽", "🥕", "🥔", 
    "🥐", "🍞", "🥨", "🧀", "🥚", "🍳", "🥞", "🥓", "🥩", "🍗"
];

class Slider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        this.wrapper = this.slider.querySelector('.slider-wrapper');
        
        this.slides = this.slider.querySelectorAll('.slide');
        
        this.nextBtn = this.slider.querySelector('.next-btn');
        this.prevBtn = this.slider.querySelector('.prev-btn');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.slideWidth = this.slider.offsetWidth;

        this.createDots();

        const newNext = this.nextBtn.cloneNode(true);
        const newPrev = this.prevBtn.cloneNode(true);
        this.nextBtn.parentNode.replaceChild(newNext, this.nextBtn);
        this.prevBtn.parentNode.replaceChild(newPrev, this.prevBtn);
        this.nextBtn = newNext;
        this.prevBtn = newPrev;

        this.nextBtn.addEventListener('click', () => {
            this.goToSlide(this.currentIndex + 1);
        });

        this.prevBtn.addEventListener('click', () => {
            this.goToSlide(this.currentIndex - 1);
        });
    }

    refreshWidth() {
        this.slideWidth = this.slider.offsetWidth;
        this.goToSlide(this.currentIndex);
    }

    createDots() {
        this.dotsContainer = this.slider.querySelector('.dots-container');
        this.dotsContainer.innerHTML = ''; 
        this.dots = [];

        this.slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => this.goToSlide(index));
            
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    goToSlide(index) {
        if (index < 0) index = this.totalSlides - 1;
        else if (index >= this.totalSlides) index = 0;

        if (this.slideWidth === 0) this.slideWidth = this.slider.offsetWidth;

        this.wrapper.style.transform = `translateX(${-index * this.slideWidth}px)`;
        this.currentIndex = index;
        this.updateDots();
    }
}

class AutoSlider extends Slider {
    constructor(selector) {
        super(selector);
        this.intervalId = null;
        this.start();

        this.slider.addEventListener('mouseenter', () => this.stop());
        this.slider.addEventListener('mouseleave', () => this.start());
    }

    start() {
        this.intervalId = setInterval(() => {
            this.goToSlide(this.currentIndex + 1);
        }, 2000);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

class Game {
    constructor(duration) {
        this.timerElement = document.querySelector('#gameTimer');
        this.timeLeft = duration;
        this.timerId = null;
        this.gameBoard = document.querySelector('#gameBoard');
        this.sliderElement = document.querySelector('#mySlider');
        this.currentStep = 1;
        this.startTimer();
    }

    startTimer() {
        this.timerElement.innerText = `Час: ${this.timeLeft} секунд`;
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.timerElement.innerText = `Час: ${this.timeLeft} секунд`;

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerId);
        this.timerElement.innerText = 'Час вийшов! Віднови порядок!';
        this.sliderElement.style.display = 'none';
        this.gameBoard.style.display = 'flex';
        this.createCards();
    }

    createCards() {
        const slides = document.querySelectorAll('.slide');
        let cardsData = [];

        slides.forEach(slide => {
            cardsData.push({
                id: Number(slide.dataset.id),
                content: slide.innerHTML
            });
        });

        cardsData.sort(() => Math.random() - 0.5);

        this.gameBoard.innerHTML = '';
        cardsData.forEach(data => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = data.content;
            card.addEventListener('click', () => this.checkClick(card, data.id));
            this.gameBoard.appendChild(card);
        });
    }

    checkClick(cardElement, cardId) {
        if (cardElement.classList.contains('correct')) return;

        const totalSlides = document.querySelectorAll('.slide').length;

        if (cardId === this.currentStep) {
            cardElement.classList.add('correct');
            this.currentStep++;

            if (this.currentStep > totalSlides) {
                this.timerElement.innerText = "🎉 ПЕРЕМОГА!";
                this.timerElement.style.color = "green";
            }
        } else {
            cardElement.classList.add('wrong');
            setTimeout(() => {
                cardElement.classList.remove('wrong');
            }, 500);
        }
    }
}

function generateSlides(count) {
    const wrapper = document.querySelector('.slider-wrapper');
    wrapper.innerHTML = '';

    const selectedEmojis = allEmojis.slice(0, count);

    selectedEmojis.forEach((emoji, index) => {
        const div = document.createElement('div');
        div.classList.add('slide');
        div.innerText = emoji;
        div.dataset.id = index + 1;
        wrapper.appendChild(div);
    });
}

function shuffleDomSlides() {
    const wrapper = document.querySelector('.slider-wrapper');
    const slides = Array.from(wrapper.querySelectorAll('.slide'));
    slides.sort(() => Math.random() - 0.5);
    slides.forEach(slide => wrapper.appendChild(slide));
}

const startBtn = document.querySelector('#startBtn');
const startScreen = document.querySelector('#startScreen');
const gameContainer = document.querySelector('#gameContainer');
const autoPlayCheckbox = document.querySelector('#autoPlayCheckbox');
const difficultySelect = document.querySelector('#difficultySelect');

startBtn.addEventListener('click', () => {
    const count = parseInt(difficultySelect.value);

    generateSlides(count);

    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';

    shuffleDomSlides();

    setTimeout(() => {
        let slider;
        if (autoPlayCheckbox.checked) {
            slider = new AutoSlider('#mySlider');
        } else {
            slider = new Slider('#mySlider');
        }
        slider.refreshWidth();
    }, 50);

    const gameTime = 60; 
    new Game(gameTime);
});