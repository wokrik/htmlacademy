import widget from '../widget.html'
import '../css/main.css'

// adding widget to the page
document.body.insertAdjacentHTML("beforeend", widget);

// DOM-elements
const widgetElement = document.querySelector('.widget');
const articlesElement = document.querySelector('.articles');
const widgetTabElement = document.querySelector('.widget__tab');
const notificationElement = document.querySelector('.unread');

// constants
const IMG_WIDTH = 254; // px, image for single article

// fetches news from url and adds them to widget
// maxQty - optional, max number of news to show
function showNews(maxQty) {
  const url = `http://wokrik.beget.tech/media/api.php`;
  const request = new Request(url);
  fetch(request).then(response => response.json()).then(data => {
    if (data.status === 'ok') {
      widgetTabElement.classList.remove('hidden');
      let articles = data.articles;
      let currentUnreadQty = data.articles.length; // how many articles are unread right now
      if (maxQty) {
        articles = articles.slice(0, maxQty);
      }
      articles.forEach(function (article) {
        articlesElement.appendChild(createArticle(article));
      });
      notificationElement.innerText = currentUnreadQty;
      document.querySelectorAll('.article').forEach(function (article) {
        article.addEventListener('click', function () {
          // if this article wasn't clicked before
          if (!this.dataset.status) {
            makeRead(this);
            // decrement amount of unread articles in notification circle
            currentUnreadQty--;
            notificationElement.innerText = currentUnreadQty;
          }
        })
      })
    } else {
      throw new Error('failed to get articles');
    }
  })
}

// gets json object (data) with info for single article
// creates html based on (data) and returns it
function createArticle(data) {
  // full article
  const article = document.createElement('a');
  article.href = data.url;
  article.target = '_blank';
  article.classList.add('article');

  const articleHeader = document.createElement('h3');
  articleHeader.classList.add('article__header');
  articleHeader.innerText = data.title;
  article.appendChild(articleHeader);

  const articleInfo = document.createElement('div');
  articleInfo.classList.add('article__info');

  const articleDate = document.createElement('div');
  articleDate.classList.add('article__date');
  // date in format  DD.MM.YY (01.01.1970)
  const ddmmyy = data.publishedAt.split('T')[0];
  // time in format  HH.MM.SS (00:30:55)
  const hhmmss = data.publishedAt.split('T')[1].split(/[Z+.]/)[0];
  articleDate.innerText = `${ddmmyy}, ${hhmmss}`;
  articleInfo.appendChild(articleDate);

  const articleAuthor = document.createElement('div');
  articleAuthor.classList.add('article__author');
  articleAuthor.innerText = (data.author === null ? 'John Doe' : data.author);

  articleInfo.appendChild(articleAuthor);
  article.appendChild(articleInfo);

  const articlePhotoContainer = document.createElement('div');
  articlePhotoContainer.classList.add('article__photo');
  article.appendChild(articlePhotoContainer);

  const articleImg = document.createElement('img');
  articleImg.src = data.urlToImage;
  articleImg.width = IMG_WIDTH;
  articlePhotoContainer.appendChild(articleImg);
  return article;
}

// makes articles read
function makeRead(article) {
  article.dataset.status = 'read';
  article.classList.add('article_read');
}

// click on widget tab => show widget and change tab colors
widgetTabElement.addEventListener('click', function () {
  widgetElement.classList.toggle('in');
  this.classList.toggle('inverse');
})

showNews();
