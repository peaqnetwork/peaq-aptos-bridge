/**
 *
 * @param ms Timout in milliseconds after that the promise will timout
 * @param promise Promise which want to timoout after the required ms argument
 * @returns Resolves if the provided promises doesnt timeout otherwise rejects
 */
export default async function promiseTimeOut<T = any>(
  ms: number,
  promise: Promise<T>
): Promise<T | any> {
  const timeout = new Promise((resolve, reject) => {
    const timeout_ = setTimeout(() => {
      clearTimeout(timeout_);
      reject("Timed out");
    }, ms);
  });
  return Promise.race([promise, timeout]);
}
