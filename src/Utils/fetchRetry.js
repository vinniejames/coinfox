/**
 * Thin fetch wrapper with retries (replaces ancient fetch-retry for CRA builds).
 */
export default function fetchRetry(url, options = {}) {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;

  const attempt = (remaining) =>
    fetch(url, fetchOptions).then((res) => {
      if (!res.ok && remaining > 0) {
        return new Promise((resolve) => setTimeout(resolve, retryDelay)).then(() =>
          attempt(remaining - 1)
        );
      }
      return res;
    }).catch((err) => {
      if (remaining > 0) {
        return new Promise((resolve) => setTimeout(resolve, retryDelay)).then(() =>
          attempt(remaining - 1)
        );
      }
      throw err;
    });

  return attempt(retries);
}
