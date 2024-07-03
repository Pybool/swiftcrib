import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-swiftcrib-carousel',
  standalone: true,
  imports: [],
  templateUrl: './swiftcrib-carousel.component.html',
  styleUrl: './swiftcrib-carousel.component.scss'
})
export class SwiftcribCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel', { static: true }) carouselRef: ElementRef | undefined;

  carousels: NodeList | undefined;
  speed: number | undefined;
  carouselLength!: number;
  width!: number;
  count!: number;
  counterIncrement!: number;
  interval: any;

  ngAfterViewInit(): void {
    this.carousels = document.querySelectorAll('.carousel');

    if (this.carousels.length > 0) {
      this.carousels.forEach((carousel: any) => this.initCarousel(carousel));
    }
  }

  ngOnInit(): void {
    // Optional: You can use this for any initialization logic before view is rendered
  }

  initCarousel(carousel: any) {
    const carouselContent = carousel.querySelector('.carousel-content');
    this.speed = parseInt(carousel.dataset.speed, 10) || 2000; // Default speed if not set
    this.carouselLength = carouselContent.children.length;
    this.width = window.innerWidth;
    this.count = this.width;
    this.counterIncrement = this.width;

    // Initial transform
    carouselContent.style.transform = `translateX(-${this.width}px)`;

    this.startCarousel(carouselContent);
    this.addClickEvents(carousel);
    this.addHoverEffects(carousel);
  }

  startCarousel(carouselContent: any) {
    this.interval = setInterval(() => {
      if (this.count >= (this.counterIncrement - 2) * (this.carouselLength - 2)) {
        this.count = 0;
        carouselContent.style.transform = `translateX(-${this.count}px)`;
      }
      this.count += this.counterIncrement;
      carouselContent.style.transform = `translateX(-${this.count}px)`;
    }, this.speed);
  }

  addClickEvents(carousel: any) {
    const carouselContent = carousel.querySelector('.carousel-content');
    const leftButton = carousel.querySelector('.carousel button:nth-child(1)');
    const rightButton = carousel.querySelector('.carousel button:nth-child(2)');

    leftButton.addEventListener('click', () => {
      this.count -= this.width;
      carouselContent.style.transform = `translateX(-${this.count - 100}px)`; // Added buffer for smooth transition
      // this.handleEdgeCase(this.count, 'left');
    });

    rightButton.addEventListener('click', () => {
      this.count += this.width;
      carouselContent.style.transform = `translateX(-${this.count + 100}px)`; // Added buffer for smooth transition
      // this.handleEdgeCase(this.count, 'right');
    });
  }

  addHoverEffects(carousel: any) {
    const carouselContent = carousel.querySelector('.carousel-content');
    const leftButton = carousel.querySelector('.carousel button:nth-child(1)');
    const rightButton = carousel.querySelector('.carousel button:nth-child(2)');

    leftButton.addEventListener('mouseenter', () => {
      carouselContent.style.transform = `translateX(-${this.count - 100}px)`;
      clearInterval(this.interval);
    });

    leftButton.addEventListener('mouseleave', () => {
      carouselContent.style.transform = `translateX(-${this.count}px)`;
      this.interval = setInterval(() => this.startCarousel(carouselContent), this.speed);
    });

    rightButton.addEventListener('mouseenter', () => {
      carouselContent.style.transform = `translateX(-${this.count + 100}px)`;
      clearInterval(this.interval);
    });

    rightButton.addEventListener('mouseleave', () => {
      carouselContent.style.transform = `translateX(-${this.count}px)`;
      this.interval = setInterval(() => this.startCarousel(carouselContent), this.speed);
    });
  }
}
