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

const getInfo = async (callback) => {
  const shop = document.getElementById("review-dex-shop").innerHTML;
  const url = "" + "/api/getMerchantDetail/" + shop;
  const data = await fetch(url);
  const { merchant, reviews } = await data.json();
  const reviewInfo = {
    totalReview: merchant.totalReviews,
    overallRating: merchant.avarageRating,
    total5Star: merchant.fiveStar,
    total4Star: merchant.fourStar,
    total3Star: merchant.threeStar,
    total2Star: merchant.twoStar,
    total1Star: merchant.oneStar,
  };
  const reviewData = reviews;
  callback(reviewInfo, reviewData);
};

function renderReviewsInfo(reviewInfo) {
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
    const totalPercent = reviewInfo.totalReview !== 0 ? Math.round((totalStar * 100) / reviewInfo.totalReview) : 0;
    bar.style.width = `${totalPercent}%`;
    total.innerText = `(${totalStar})`;
  }
}

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

function renderReviews(reviewData) {
  const reviewContentDiv = document.querySelector(".review-content");
  reviewData.forEach((reviewItem) => {
    const reviewItemDiv = document.createElement("div");
    reviewItemDiv.className = "review-item";
    const reviewImage = document.createElement("img");
    reviewImage.src = reviewItem.customerImg;
    reviewImage.alt = reviewItem.name;
    reviewItemDiv.appendChild(reviewImage);
    const reviewDetailDiv = document.createElement("div");
    reviewDetailDiv.className = "review-detail";
    const para1 = document.createElement("p");
    para1.innerText = reviewItem.name;
    const para2 = document.createElement("p");
    para2.innerText = reviewItem.created.substring(0,9);
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
    para3.innerText = reviewItem.body;
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
getInfo((reviewInfo, reviewData) => {
  renderReviewsInfo(reviewInfo);
  renderReviews(reviewData);
});
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
  getInfo((reviewInfo, reviewData) => {
    setReviewDrop();
    renderReviewsInfo(reviewInfo);
    renderReviews(reviewData);
    setStars();
  });
});
