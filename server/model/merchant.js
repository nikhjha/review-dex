import { Schema, model } from "mongoose";


const merchantSchema = new Schema({
    shop : String,
    avarageRating : Number,
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

