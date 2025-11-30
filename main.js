class Slider {
    constructor(selector) {
        this.slider = document.querySelector(selector)
        this.wrapper = this.slider.querySelector('.slider-wrapper')
        this.slides = this.slider.querySelectorAll('.slide')


        this.currentIndex = 0;
        this.slideWidth = this.slider.offsetWidth;
        this.totalSlides = this.slides.length;

        this.nextBtn = this.slider.querySelector('.next-btn')
        this.prevBtn = this.slider.querySelector('.prev-btn')

        this.nextBtn.addEventListener('click', () => {
            this.goToSlide(this.currentIndex + 1)
        })

        this.prevBtn.addEventListener('click', () => {
            this.goToSlide(this.currentIndex - 1)
        })

    }

    goToSlide(index) {
        if (index < 0) {
            index = this.totalSlides - 1;
        } else if (index >= this.totalSlides) {
            index = 0
        }

        this.wrapper.style.transform = 'translateX(' + (-(index * this.slideWidth)) + 'px)';

        this.currentIndex = index;
    }

}

class AutoSlider extends Slider {
    constructor(selector) {
        super(selector)

        this.intervalId = null;

        this.start();

        this.slider.addEventListener('mouseenter', () => {
            this.stop();
        })
        this.slider.addEventListener('mouseleave', () => {
            this.start();
        })
    }

    start() {
        this.intervalId = setInterval(() => {
            this.goToSlide(this.currentIndex + 1);
        }, 5000)
    }

    stop() {
        clearInterval(this.intervalId)
    }
}

new AutoSlider('#mySlider')