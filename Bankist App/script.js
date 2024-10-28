'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////
//////////////////////

// button scroll

btnScrollTo.addEventListener('click', function (e) {
  // const s1coods = section1.getBoundingClientRect();
  //   // console.log(s1coods);

  // console.log(e.target.getBoundingClientRect());

  // console.log('current scroll', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height/width',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //scrolling
  // window.scrollTo(
  //   s1coods.left + window.pageXOffset,
  //   s1coods.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coods.left + window.pageXOffset,
  //   top: s1coods.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////

////page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = document.querySelector(`${this.getAttribute('href')}`);

//     id.scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event Delegation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = document.querySelector(`${e.target.getAttribute('href')}`);

    id.scrollIntoView({ behavior: 'smooth' });
  }
});
////////////////////

/// Tab component

// Event Delegation
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  //It will prevent the container click
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Active content area
  //   const dataTab = clicked.getAttribute('data-tab');
  //   const clickedcontent = document.querySelector(
  //     `.operations__content--${dataTab}`
  //   );
  //   clickedcontent.classList.add('operations__content--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////

//menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //this = opacity
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////

//Sticky navigation
// const initialcoords = section1.getBoundingClientRect();
// console.log(initialcoords);

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialcoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Sticky navigation:Intersection observer API

// // call back function
// // it also has observer as a parameter value
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// //method
// // when target hit the root with threshold( single or array )
// // null = veiwport
// const obsOption = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOption);
// // observe = target
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: '-90px',
  rootMargin: `-${navHeight}px`, // responsive
});
headerObserver.observe(header);

//////////////////////

//Reveal Sections
const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////
//Lazy loading image

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  //forEach bc refresh page midway also load img seperately
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    //Replace src with data-src
    entry.target.src = entry.target.dataset.src; // it emit load after complete

    entry.target.addEventListener('load', function () {
      // after change the src then only remove blur
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

/////////////////

//slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlides = slides.length;

  // Functions
  const createDot = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const dotActivate = function (curDot) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${curDot}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide == maxSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    dotActivate(curSlide);
  };

  const prevSlide = function () {
    if (curSlide == 0) {
      curSlide = maxSlides - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    dotActivate(curSlide);
  };

  const init = function () {
    createDot();
    dotActivate(0);
    goToSlide(curSlide);
  };
  init();

  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e.key);
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      curSlide = slide;
      goToSlide(curSlide);
      dotActivate(curSlide);
    }
  });
};
slider();
////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// // document;

// const message = document.createElement('div');

// message.classList.add('cookie-message');

// //message.textContent = 'We use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.append(message);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     message.parentElement.removeChild(message);
//   });

// // style
// message.style.backgroundColor = 'black';
// message.style.width = '120%';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// const h1 = document.querySelector('h1');
// const alertHi = function (e) {
//   alert('hi');

//   h1.removeEventListener('mouseenter', alertHi);
// };

// h1.addEventListener('mouseenter', alertHi);

// h1.onmouseenter = () => alert('hi');

///////////////
// dom traversing

// const h1 = document.querySelector('h1');

// // Going downwards : child
// console.log(h1.querySelectorAll('.highlight')); //  nodeList
// console.log(h1.childNodes); //  nodeList
// console.log(h1.childElementCount); // number of count

// console.log(h1.firstChild);
// console.log(h1.firstElementChild); // in use

// console.log(h1.lastChild);
// console.log(h1.lastElementChild); // in use

//Going upward : parent

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// console.log(h1.closest('.header'));

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children); // HTMLCollections
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

//////////////////////////////

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tre built !', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Full page is loaded ', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log('hi', e);
//   e.returnValue = '';
// });
