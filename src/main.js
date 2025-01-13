import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import { createGalleryCardTemplate } from './js/render-functions';
import { fetchPhotosByQuery } from './js/pixabay-api';

const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');
const loaderEl = document.querySelector('.js-loader');

let lightbox;
let page = 1;
let inputValue = '';

const showEndOfResultsMessage = () => {
  iziToast.info({
    message: "We're sorry, but you've reached the end of search results.",
    position: 'topRight',
    timeout: 3000,
  });
};

const clearGallery = () => {
  galleryEl.innerHTML = '';
};

const loadImages = async () => {
  try {
    loadMoreBtnEl.classList.add('is-hidden');
    const response = await fetchPhotosByQuery(inputValue, page);

    if (response.totalHits === 0) {
      iziToast.error({
        message: `Sorry, there are no images matching your search query "${inputValue}". Please try again!`,
        position: 'topRight',
        timeout: 3000,
      });
      clearGallery();
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }

    const { hits, totalHits } = response;

    galleryEl.insertAdjacentHTML('beforeend', createGalleryCardTemplate(hits));

    if (!lightbox) {
      lightbox = new SimpleLightbox('.gallery-link', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
      });
    } else {
      lightbox.refresh();
    }

    if (page * 15 >= totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      showEndOfResultsMessage();
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    const cardHeight =
      galleryEl.firstElementChild.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    iziToast.error({
      message:
        'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
      timeout: 3000,
    });
    console.error(err);
  } finally {
    loaderEl.classList.add('is-hidden');
  }
};

const onSearchFormSubmit = async event => {
  event.preventDefault();

  inputValue = event.currentTarget.elements.user_query.value.trim();
  page = 1;

  if (inputValue === '') {
    iziToast.error({
      message: 'Please enter a search word',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  clearGallery();
  loadMoreBtnEl.classList.add('is-hidden');
  loaderEl.classList.remove('is-hidden');

  await loadImages();
};

const onLoadMoreBtnClick = async () => {
  page++;
  loaderEl.classList.remove('is-hidden');
  await loadImages();
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
