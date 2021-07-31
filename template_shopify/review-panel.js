function setReviewDrop() {
  const reviewDrop = document.querySelector("#review-drop");
  const reviewDropBtn = document.querySelector("#review-drop-btn");
  let reviewDropState = false;
  reviewDropBtn.addEventListener("click", () => {
    reviewDropState = !reviewDropState;
    reviewDrop.style.display = reviewDropState ? "block" : "none";
    const bars = document.querySelectorAll(".star-bar");
    bars.forEach((bar) => {
      if (reviewDropState) {
        bar.children[0].className = "getfull";
      } else {
        bar.children[0].className = "";
      }
    });
  });
}
setReviewDrop();
const reviewInfo = {
  totalReview: 1966,
  overallRating: 4.9,
  total5Star: 1767,
  total4Star: 181,
  total3Star: 16,
  total2Star: 2,
  total1Star: 0,
};

function renderReviewsInfo() {
  const totalReviews = document.querySelector("#total-reviews");
  totalReviews.innerText = `${reviewInfo.totalReview} Reviews`;
  document
    .querySelector(".review-bar")
    .querySelector("input").value = Math.round(reviewInfo.overallRating);
  const ratingInDrop = document
    .querySelector("#review-drop")
    .querySelector("p");
  ratingInDrop.innerHTML =
    ratingInDrop.innerHTML + " " + reviewInfo.overallRating;
  for (let i = 1; i <= 5; i++) {
    const bar = document.querySelector(`#star${i}-bar`).querySelector("div");
    const total = document.querySelector(`#star${i}-total`);
    let totalStar;
    switch (i) {
      case 1:
        totalStar = reviewInfo.total1Star;
        break;
      case 2:
        totalStar = reviewInfo.total2Star;
        break;
      case 3:
        totalStar = reviewInfo.total3Star;
        break;
      case 4:
        totalStar = reviewInfo.total4Star;
        break;
      case 5:
        totalStar = reviewInfo.total5Star;
        break;
      default:
        break;
    }
    const totalPercent = Math.round((totalStar * 100) / reviewInfo.totalReview);
    bar.style.width = `${totalPercent}%`;
    total.innerText = `(${totalStar})`;
  }
}

const reviewData = [
  {
    name: "Aditi S.",
    img: "http://127.0.0.1:5500/pic-1.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 5,
    review: "Good.",
  },
  {
    name: "Harshada T.",
    img: "http://127.0.0.1:5500/pic-2.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 5,
    review:
      "This dress steal my heart 💖 i am in love with this dress infact all dresses which i bought from berrylush recently!! The fabric, fitting and comfort is AWESOME.. all i wanna say is i love you berrylush ❤️ thank you for making my birthday so special 💯❤️",
  },
  {
    name: "Suman Y.",
    img: "http://127.0.0.1:5500/pic-3.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 5,
    review:
      "Great quality , amazing fitting, feels great to wear it. Very very stylish top . Loved it.",
  },
  {
    name: "manish p.",
    img: "http://127.0.0.1:5500/pic-4.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 4,
    review: "gud",
  },
  {
    name: "Suman Y.",
    img: "http://127.0.0.1:5500/pic-3.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 5,
    review:
      "Great quality , amazing fitting, feels great to wear it. Very very stylish top . Loved it.",
  },
  {
    name: "Aditi S.",
    img: "http://127.0.0.1:5500/pic-1.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 5,
    review: "Good.",
  },
  {
    name: "Harshada T.",
    img: "http://127.0.0.1:5500/pic-2.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 5,
    review:
      "This dress steal my heart 💖 i am in love with this dress infact all dresses which i bought from berrylush recently!! The fabric, fitting and comfort is AWESOME.. all i wanna say is i love you berrylush ❤️ thank you for making my birthday so special 💯❤️",
  },
  {
    name: "manish p.",
    img: "http://127.0.0.1:5500/pic-4.png",
    alt: "profile-pic",
    productImg: "http://127.0.0.1:5500/product-pic.png",
    productInfo: "BERRYLUSH WOMEN BLACK FLORAL PRINT SHOULDER STRAP TOP",
    date: "7/26/2021",
    rating: 4,
    review: "gud",
  },
];

function resizeGridItem(content, grid) {
  rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  );
  rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
  );
  rowSpan = Math.ceil(
    (content.querySelector(".review-product").getBoundingClientRect().height +
      content.querySelector("img").getBoundingClientRect().height +
      rowGap +
      content.querySelector(".review-detail").getBoundingClientRect().height) /
      (rowHeight + rowGap)
  );
  content.style.gridRowEnd = "span " + rowSpan;
}

function renderReviews() {
  const reviewContentDiv = document.querySelector(".review-content");
  reviewData.forEach((reviewItem) => {
    const reviewItemDiv = document.createElement("div");
    reviewItemDiv.className = "review-item";
    const reviewImage = document.createElement("img");
    reviewImage.src = reviewItem.img;
    reviewImage.alt = reviewItem.alt;
    reviewItemDiv.appendChild(reviewImage);
    const reviewDetailDiv = document.createElement("div");
    reviewDetailDiv.className = "review-detail";
    const para1 = document.createElement("p");
    para1.innerText = reviewItem.name;
    const para2 = document.createElement("p");
    para2.innerText = reviewItem.date;
    reviewDetailDiv.appendChild(para1);
    reviewDetailDiv.appendChild(para2);
    const reviewStars = document.createElement("div");
    reviewStars.className = "stars";
    const reviewRating = document.createElement("input");
    reviewRating.name = "rating";
    reviewRating.type = "number";
    reviewRating.value = reviewItem.rating;
    reviewStars.appendChild(reviewRating);
    reviewDetailDiv.appendChild(reviewStars);
    const para3 = document.createElement("p");
    para3.innerText = reviewItem.review;
    reviewDetailDiv.appendChild(para3);
    const productInfo = document.createElement("div");
    productInfo.className = "review-product";
    const productImg = document.createElement("img");
    productImg.src = reviewItem.productImg;
    productImg.alt = "product-pic";
    const para4 = document.createElement("p");
    para4.innerText = reviewItem.productInfo;
    productInfo.appendChild(productImg);
    productInfo.appendChild(para4);
    reviewItemDiv.appendChild(reviewDetailDiv);
    reviewItemDiv.appendChild(productInfo);
    reviewContentDiv.appendChild(reviewItemDiv);
    reviewImage.addEventListener("load", () => {
      resizeGridItem(reviewItemDiv, reviewContentDiv);
    });
    productImg.addEventListener("load", () => {
      resizeGridItem(reviewItemDiv, reviewContentDiv);
    });
  });
}
renderReviewsInfo();
renderReviews();
function setStars() {
  const stars = document.querySelectorAll(".stars");
  stars.forEach((starDiv) => {
    const rating = starDiv.querySelector("input").value;
    starDiv.removeChild(starDiv.querySelector("input"));
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.className = "material-icons-outlined";
      if (i <= rating) {
        star.innerText = "star";
      } else {
        star.innerText = "star_border";
      }
      starDiv.appendChild(star);
    }
  });
}
window.onload = () => {
  setStars();
};
document.addEventListener("shopify:section:load", () => {
  setReviewDrop();
  renderReviewsInfo();
  renderReviews();
  setStars();
});
