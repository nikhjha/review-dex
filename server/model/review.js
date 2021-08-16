import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    merchantID : String,
    rating: Number,
    created: Date,
    name: String,
    about: String,
    title: String,
    body: String,
    source: String,
    hidden: Boolean,
    customerImg : String,
    productImg : String,
    productInfo : String,
});

const Review = model("Review", reviewSchema);

export default Review;