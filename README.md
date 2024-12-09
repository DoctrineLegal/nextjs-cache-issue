##

Next.js cache is not working with CircleCI since this PR : https://github.com/vercel/next.js/blob/0924393b89d2353e8483005ae1f9fa39319ae9a2/packages/next/src/server/cache-dir.ts#L4 that detects CircleCI as a docker ephemeral container and not caching it's `.rscinfo` file.

To use the cache the CI is running the following command: 
```
run: cp cache-dir-fixed.js node_modules/next/dist/server/cache-dir.js
```

 overriding `node_modules/next/dist/server/cache-dir.js` with the one in this repository.
