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
