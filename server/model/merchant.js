import { Schema, model } from "mongoose";


const merchantSchema = new Schema({
    shop : String,
    averageRating : Number,
    totalReviews : Number,
    oneStar : Number,
    twoStar : Number,
    threeStar : Number,
    fourStar : Number,
    fiveStar : Number,
    emailRequest : Number,
});

const Merchant = model("Merchant", merchantSchema);

export default Merchant;

