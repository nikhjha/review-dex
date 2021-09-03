class ReviewPanel {
  constructor() {
    this.link = "";
    this.reviewInfo = {};
    this.reviewData = [];
    this.items = 6;
    this.setBadge();
    const widgetInfoDocument = document.getElementById("review_dex_widget_info");
    if(!widgetInfoDocument){
      this.ismount = false;
      return;
    }
    this.setReviewDrop();
    this.setModal();
    this.setAddMore();
    this.ismount = true;
    const widgetInfo = widgetInfoDocument.classList;
    this.shop = widgetInfo[0];
    this.productReview = widgetInfo[1] !== "review_dex_all_review_panel";
    if(this.productReview){
      this.productID = widgetInfo[2];
      this.setWriteModal();
    }
  }
  setAddMore(){
    const btn = document.getElementById("review_dex_add_more_review_btn");
    btn.addEventListener("click",()=>{
      this.items = this.items + 3;
      this.getInfo();
    });
  }
  renderAddMore(){
    const btn = document.getElementById("review_dex_add_more_review_btn");
    if(this.totalReviews <= this.items){
      btn.style.display = "none";
    }
  }
  setBadge() {
    const badges = document.querySelectorAll(".review_dex_badge_div");
    if(badges.length === 0){
      return;
    }
    else{
      badges.forEach(async(badge)=>{
        const shop = badge.classList[1];
        const productID = badge.classList[3];
        const widgetType = badge.classList[2];
        if(!productID){
          return;
        }
        if(widgetType === "review_dex_link_badge"){
          const linkBadge = badge.querySelector(".review_dex_product_badge");
          linkBadge.style.curser = "pointer";
          linkBadge.addEventListener("click",()=>{
            location.href = "#review_dex_widget_info"; 
          });
        }
        const url = this.link + "/shop/product?shop=" + shop + "&product_id="+productID + "&with_reviews=false";
        const data = await fetch(url);
        const { product } = await data.json();
        if(product.totalReviews === 0){
          return;
        }else{
          badge.style.display = "block";
        }
        badge.querySelector(".review_dex_stars > input").value = Math.round(product.averageRating);
        badge.querySelector(".review_dex_product_badge > span").innerHTML = "("+product.totalReviews+" reviews)";
      });
      this.setStars();
    }
  }
  setModal() {
    const modalDiv = document.querySelector(".review_dex_modal");
    const modalCloser = document.querySelector("#review_dex_model_cls_btn");
    modalCloser.addEventListener("click",()=>{
      modalDiv.style.display = "none";
      this.modelItem = {};
    }); 
  }
  setWriteModal() {
    const writeBtn = document.querySelector("#review_dex_write_review_btn");
    writeBtn.style.display = "block";
    const modalDiv = document.querySelector(".review_dex_write_modal");
    writeBtn.addEventListener("click", () => {
      modalDiv.style.display = "flex";
    });
    document.addEventListener("click", (e) => {
      if(e.target === modalDiv){
        modalDiv.style.display = "none";
      }
    });
    const imgInput  = document.querySelector("#review_dex_form_section-2 > div > input");
    const imgLabel  = document.querySelector("#review_dex_form_section-2 > div > label");
    imgInput.addEventListener("change", (e) => {
      imgLabel.innerHTML = e.target.files.length + " file selected";
    });
    const modalCloser = document.querySelector("#review_dex_write_model_cls_btn");
    modalCloser.addEventListener("click",()=>{
      modalDiv.style.display = "none";
    }); 
    const writeForm = document.getElementById("review_dex_write_form");
    writeForm.addEventListener("submit", async(e)=>{
      e.preventDefault();
      const formData = new FormData(e.target);
      const modalDiv = document.querySelector(".review_dex_write_modal");
      modalDiv.style.display = "none";
      const response = await fetch(this.link + "/shop/review?shop="+this.shop, {method : "post", body : formData});
      console.log(response);
      location.reload();
    });
    const modelContainer = document.querySelector(".review_dex_write_modal_container");
    modalDiv.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const scrollTo = e.target.href.split("-");
        const sectionNo = (scrollTo[scrollTo.length - 1] - "0");
        const scrollHeight = (sectionNo - 1)*500;
        modelContainer.scrollTop = scrollHeight;
      });
    });
    const ratingInput = document.getElementById("review_dex_form_rating");
    const btn5 = document.getElementById("review_dex_form_rating_no_5");
    btn5.addEventListener("click",(e)=>{e.preventDefault();ratingInput.value = '5';location.href = "#review_dex_form_section-2"});  
    const btn4 = document.getElementById("review_dex_form_rating_no_4");
    btn4.addEventListener("click",(e)=>{e.preventDefault();ratingInput.value = '4';location.href = "#review_dex_form_section-2"});  
    const btn3 = document.getElementById("review_dex_form_rating_no_3");
    btn3.addEventListener("click",(e)=>{e.preventDefault();ratingInput.value = '3';location.href = "#review_dex_form_section-2"});  
    const btn2 = document.getElementById("review_dex_form_rating_no_2");
    btn2.addEventListener("click",(e)=>{e.preventDefault();ratingInput.value = '2';location.href = "#review_dex_form_section-2"});  
    const btn1 = document.getElementById("review_dex_form_rating_no_1");
    btn1.addEventListener("click",(e)=>{e.preventDefault();ratingInput.value = '1';location.href = "#review_dex_form_section-2"});
  }
  renderModel(){
    const model = document.querySelector(".review_dex_modal");
    document.addEventListener("click", (e)=>{
      if(e.target === model){
        model.style.display = "none";
        this.modelItem = {};
      }
    });
    const nameDiv = document.querySelector(".review_dex_model_content_header_1 > p");
    nameDiv.innerHTML = this.modelItem.name;
    const ratingDiv = document.querySelector(".review_dex_model_content_header_1 > .review_dex_stars > input ");
    ratingDiv.value = this.modelItem.rating;
    const dateDiv = document.querySelector(".review_dex_model_content_header_2 > p:nth-child(1)");
    dateDiv.innerHTML = this.modelItem.created.substring(0,10);
    const varifiedDiv = document.querySelector(".review_dex_model_content_header_2 > p:nth-child(2)");
    varifiedDiv.innerHTML = this.modelItem.verified ? "<span class='material-icons'> verified </span>Verified Purchase" : "";
    const bodyDiv = document.querySelector(".review_dex_model_content > p");
    bodyDiv.innerHTML = this.modelItem.body;
    const productInfoDiv = document.querySelector(".review_dex_model_content_footer > .review_dex_product > p");
    productInfoDiv.innerHTML = this.modelItem.about;
    const customerImgDiv = document.querySelector(".review_dex_model_img");
    const customerImg = document.querySelector(".review_dex_model_img > img");
    if(this.modelItem.customerImg[0] && this.modelItem.customerImg[0] !== ""){
      if(document.querySelector(".review_dex_modal_container_without_img")){
        document.querySelector(".review_dex_modal_container_without_img").className = "review_dex_modal_container";
      }
      if(customerImg){
        customerImg.alt = this.modelItem.name;
        customerImg.src = this.modelItem.customerImg[0];
        customerImg.addEventListener("load",()=>{
          const aspectRatio = customerImg.getBoundingClientRect().width / customerImg.getBoundingClientRect().height;
          if(aspectRatio > 1){
            customerImg.style.width = "100%";
          }else{
            customerImg.style.height = "100%";
          }
        });
      }else{
        const modelImg = document.querySelector(".review_dex_model_img"); 
        const customerImg = document.createElement("img");
        customerImg.alt = this.modelItem.name;
        customerImg.src = this.modelItem.customerImg[0];
        modelImg.append(customerImg);
        customerImg.addEventListener("load",()=>{
          const aspectRatio = customerImg.getBoundingClientRect().width / customerImg.getBoundingClientRect().height;
          if(aspectRatio > 1){
            customerImg.style.width = "100%";
          }else{
            customerImg.style.height = "100%";
          }
        });
      }
    }else{
      if(document.querySelector(".review_dex_modal_container")){
        document.querySelector(".review_dex_modal_container").className = "review_dex_modal_container_without_img";
      }
      const customerImg = document.querySelector(".review_dex_model_img > img");
      if(customerImg){
        customerImg.remove();
      }
    }
    this.setStars();
  }
  setReviewDrop() {
    const reviewDrop = document.querySelector("#review_dex_dropdown");
    const reviewDropBtn = document.querySelector("#review_dex_dropdown_btn");
    let reviewDropState = false;
    reviewDropBtn.addEventListener("click", () => {
      reviewDropState = !reviewDropState;
      reviewDrop.style.display = reviewDropState ? "block" : "none";
      const bars = document.querySelectorAll(".review_dex_progress_bar");
      bars.forEach((bar) => {
        if (reviewDropState) {
          bar.children[0].className = "review_dex_getfull";
        } else {
          bar.children[0].className = "";
        }
      });
    });
    const reviewSortDrop = document.querySelector("#review_dex_sort_dropdown");
    const reviewDropSortBtn = document.querySelector("#review_dex_sort_btn");
    let reviewDropSortState = false;
    reviewDropSortBtn.addEventListener("click",()=>{
      reviewDropSortState = !reviewDropSortState;
      reviewSortDrop.style.display = reviewDropSortState ? "block" : "none";
    });
  }
  async getInfo() {
    if(!this.ismount){
      return;
    }
    if(this.productReview){
      const url = this.link + "/shop/product?shop=" + this.shop + "&product_id="+ this.productID + "&with_reviews=true&items=" + this.items;
      const data = await fetch(url);
      const { product, reviews } = await data.json();
      const reviewInfo = {
        totalReview: product.totalReviews,
        overallRating: product.averageRating,
        total5Star: product.fiveStar,
        total4Star: product.fourStar,
        total3Star: product.threeStar,
        total2Star: product.twoStar,
        total1Star: product.oneStar,
      };
      console.log(product);
      this.reviewData = reviews;
      this.reviewInfo = reviewInfo;
      this.totalReviews = product.totalReviews;
    }else{
      const url = this.link + "/shop/review?shop=" + this.shop + "&items=" + this.items;
      const data = await fetch(url);
      const { merchant, reviews } = await data.json();
      const reviewInfo = {
        totalReview: merchant.totalReviews,
        overallRating: merchant.averageRating,
        total5Star: merchant.fiveStar,
        total4Star: merchant.fourStar,
        total3Star: merchant.threeStar,
        total2Star: merchant.twoStar,
        total1Star: merchant.oneStar,
      };
      this.reviewData = reviews;
      this.reviewInfo = reviewInfo;
      this.totalReviews = merchant.totalReviews;
    }
    this.renderReviewsInfo();
    this.renderReviews();
    this.renderAddMore();
    this.setStars();
  }

  renderReviewsInfo() {
    const reviewInfo = this.reviewInfo;
    const totalReviews = document.querySelector("#review_dex_total_reviews");
    totalReviews.innerText = `${reviewInfo.totalReview} Reviews`;
    document.querySelector(
      ".review_dex_nav > .review_dex_stars > input"
    ).value = Math.round(reviewInfo.overallRating);
    const ratingInDrop = document.querySelector("#review_dex_dropdown > p");
    ratingInDrop.innerHTML =
      "<span class='material-icons-outlined'> star </span> " + reviewInfo.overallRating;
    for (let i = 1; i <= 5; i++) {
      const bar = document.querySelector(`#review_dex_${i}_progress_bar > div`);
      const total = document.querySelector(`#review_dex_${i}_review_count`);
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
      const totalPercent =
        reviewInfo.totalReview !== 0
          ? Math.round((totalStar * 100) / reviewInfo.totalReview)
          : 0;
      bar.style.width = `${totalPercent}%`;
      total.innerText = `(${totalStar})`;
    }
  }

  resizeGridItem(content, grid) {
    const rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
    );
    const rowGap = parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
    );
    const rowSpan = Math.ceil(
      (content.querySelector(".review_dex_item_content").getBoundingClientRect()
        .height +
        rowGap) /
        (rowHeight + rowGap)
    );
    content.style.gridRowEnd = "span " + (rowSpan + 1);
  }
  

  renderReviews() {
    const reviewData = this.reviewData;
    const reviewContentDiv = document.querySelector(".review_dex_content");
    const prevDataDivs = document.querySelectorAll(".review_dex_item");
    prevDataDivs.forEach((dataDiv) => {dataDiv.remove()});
    reviewData.forEach((reviewItem) => {
      const reviewItemMainDiv = document.createElement("div");
      reviewItemMainDiv.className = "review_dex_item";
      const reviewItemDiv = document.createElement("div");
      reviewItemDiv.className = "review_dex_item_content";
      if (reviewItem.customerImg[0] && reviewItem.customerImg[0] !== "") {
        const reviewImage = document.createElement("img");
        reviewImage.src = reviewItem.customerImg[0];
        reviewImage.alt = reviewItem.name;
        reviewItemDiv.appendChild(reviewImage);

        reviewImage.addEventListener("load", () => {
          this.resizeGridItem(reviewItemMainDiv, reviewContentDiv);
        });
      }
      const reviewDetailDiv = document.createElement("div");
      reviewDetailDiv.className = "review_dex_review_detail";
      const para1 = document.createElement("p");
      para1.innerHTML = reviewItem.verified ? ""+reviewItem.name+" <span class='material-icons'> verified </span>" : reviewItem.name;
      const para2 = document.createElement("p");
      para2.innerText = reviewItem.created.substring(0, 10);
      reviewDetailDiv.appendChild(para1);
      reviewDetailDiv.appendChild(para2);
      const reviewStars = document.createElement("div");
      reviewStars.className = "review_dex_stars";
      const reviewRating = document.createElement("input");
      reviewRating.name = "rating";
      reviewRating.type = "number";
      reviewRating.value = reviewItem.rating;
      reviewStars.appendChild(reviewRating);
      reviewDetailDiv.appendChild(reviewStars);
      const para3 = document.createElement("p");
      para3.innerText = reviewItem.body;
      reviewDetailDiv.appendChild(para3);
      reviewItemDiv.appendChild(reviewDetailDiv);
      if(!this.productReview){
        const productInfo = document.createElement("div");
        productInfo.className = "review_dex_product";
        const para4 = document.createElement("p");
        para4.innerText = reviewItem.about;
        productInfo.appendChild(para4);
        reviewItemDiv.appendChild(productInfo);
      }
      reviewItemMainDiv.appendChild(reviewItemDiv);
      reviewItemMainDiv.addEventListener("click",()=>{
        this.modelItem = reviewItem;
        console.log(this.modelItem);
        const modalDiv = document.querySelector(".review_dex_modal");
        modalDiv.style.display = "flex";
        this.renderModel();
      });
      reviewContentDiv.appendChild(reviewItemMainDiv); 
      this.resizeGridItem(reviewItemMainDiv, reviewContentDiv); 
    });
  }
  setStars() {
    const stars = document.querySelectorAll(".review_dex_stars");
    stars.forEach((starDiv) => {
      const rating = starDiv.querySelector("input").value;
      const prevChild = starDiv.querySelectorAll("span");
      if(prevChild.length !== 0){
        starDiv.removeChild(prevChild[0]);
        starDiv.removeChild(prevChild[1]);
        starDiv.removeChild(prevChild[2]);
        starDiv.removeChild(prevChild[3]);
        starDiv.removeChild(prevChild[4]);
      }
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
}

const reviewPanel = new ReviewPanel();
reviewPanel.getInfo();


window.onload = () => {
  reviewPanel.setStars();
};
document.addEventListener("shopify:section:load", () => {
  const reviewPanel = new ReviewPanel();
  reviewPanel.getInfo();
});
