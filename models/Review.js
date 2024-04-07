import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
// Only one review per product by user
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log("post save");
});
ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calculateAverageRating(this.product);
    console.log("post delete");
  }
);
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRaiting: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        numOfReviews: Math.ceil(result[0]?.numOfReviews || 0),
        averageRaiting: result[0]?.numOfReviews || 0,
      }
    );
  } catch (err) {}
  console.log(result);
};
const Review = mongoose.model("Review", ReviewSchema);
export default Review;
