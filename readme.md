## Work with cookies

- attach cookies to response
- in order to get cookies from response we need cookie-parser
- every time when browser sending request with the cookie we have acces to req.cookies

## Check Permission

- user can view only his profile

```js
const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser._id === resourceUserId.toString()) return;
  throw new UnothorizedError("No authorized to access this route");
};
```

### Populate method

- get products fields name, company, price

```js
const reviews = await Review.find({}).populate({
  path: "product",
  select: "name company price",
});
```

## Set up Virtuals on model

- you can't query virtuals propery
- create virtual property on Products model
- 'reviews' is property name

```js
 { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
```

```js
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});
```

- add populate method to getSingleProduct

```js
const product = await Product.findOne({ _id: productId }).populate("reviews");
```
