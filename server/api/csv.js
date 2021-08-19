import Router from "koa-router";
import multer from "@koa/multer";
import Shopify from "@shopify/shopify-api";
import Merchant from "../model/merchant";
import Review from "../model/review";
import * as csv from "fast-csv";
import * as fs from "fs";
import * as path from "path";

const router = Router();

const storage = multer.diskStorage({
    destination: path.resolve("server", "..", "public", "csv"),
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /csv/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb("Error: csv Only!");
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post("/", upload.single("myCSV"), async (ctx) => {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

    if (!ctx.file) {
        ctx.response.status = 200;
        return;
    } else {
        const doc = await Merchant.findOne({ shop: shop });
        const filePath = path.resolve(
            "server",
            "..",
            "public",
            "csv",
            ctx.file.filename
        );
        let totalReviews = 0;
        let oneStar = 0;
        let twoStar = 0;
        let threeStar = 0;
        let fourStar = 0;
        let fiveStar = 0;
        function calculateAverage(){
            const ans = doc.oneStar + 2 * doc.twoStar + 3 * doc.threeStar + 4 * doc.fourStar + 5 * doc.fiveStar + oneStar + 2 * twoStar + 3 * threeStar + 4 * fourStar + 5 * fiveStar;
            return ans / (doc.totalReviews + totalReviews);
        }
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => console.error(error))
            .on("data", async (row) => {
                if (!row) {
                    return;
                }
                totalReviews += 1;
                const { reviewer_name, review_date, source, title, body, reviewer_email, product_id, product_handle, picture_urls } = row;
                let rating;
                if (typeof (row.rating) === "string") {
                    rating = ctx.request.body.rating - "0";
                } else {
                    rating = ctx.request.body.rating;
                }
                switch (rating) {
                    case 5:
                        fiveStar += 1;
                        break;
                    case 4:
                        fourStar += 1;
                        break;
                    case 3:
                        threeStar += 1;
                        break;
                    case 2:
                        twoStar += 1;
                        break;
                    case 1:
                        oneStar += 1;
                        break;
                    default :
                        break;
                }
                const newReview = new Review({
                    merchantID: doc.id,
                    name: reviewer_name,
                    email: reviewer_email,
                    rating,
                    title,
                    body,
                    about: product_id === "" ? "your shop" : product_handle,
                    hidden: false,
                    source: source.toUpperCase(),
                    productInfo: product_id !== "" ? product_id : "",
                    customerImg: picture_urls.split(","),
                    created: review_date,
                });
                await newReview.save();
            })
            .on("end", () => {
                fs.unlink(filePath, (err) => {
                    console.log(err);
                });
                const newMerchantData = {
                    totalReviews: doc.totalReviews + totalReviews,
                    averageRating: calculateAverage(),
                    oneStar: doc.oneStar + oneStar,
                    twoStar: doc.twoStar + twoStar,
                    threeStar: doc.threeStar + threeStar,
                    fourStar: doc.fourStar + fourStar,
                    fiveStar: doc.fiveStar + fiveStar,
                }
                await Merchant.updateOne({ shop: shop }, { $set: { ...newMerchantData } });
            });
        ctx.response.status = 200;
    }
});

export default router;
