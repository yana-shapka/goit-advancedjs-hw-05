export const createGalleryCardTemplate = imgArr => {
  return imgArr.reduce((acc, el) => {
    return (
      acc +
      `
      <li class="gallery-card">
        <a class="gallery-link" href="${el.largeImageURL}">
          <img class="gallery-img" src="${el.webformatURL}" alt="${el.tags}" />
        </a>
        <div class="gallery-info">
          <p><span>Likes:</span> ${el.likes}</p>
          <p><span>Views:</span> ${el.views}</p>
          <p><span>Comments:</span> ${el.comments}</p>
          <p><span>Downloads:</span> ${el.downloads}</p>
        </div>
      </li>
    `
    );
  }, '');
};
