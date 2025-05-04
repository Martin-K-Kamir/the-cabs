/* eslint-disable @typescript-eslint/no-explicit-any */

type Fn<Args extends any[], Return> = (this: any, ...args: Args) => Return;

export function memoize<Args extends any[], Return>(
    func: Fn<Args, Return>,
): Fn<Args, Return> {
    const cache = new Map<any, any>();

    return function (this: any, ...args: Args): Return {
        let currentCache = cache;

        args.forEach(arg => {
            if (!currentCache.has(arg)) {
                currentCache.set(arg, new Map<any, any>());
            }
            currentCache = currentCache.get(arg);
        });

        if (currentCache.has("result")) {
            return currentCache.get("result");
        }

        const result = func.apply(this, args);
        currentCache.set("result", result);
        return result;
    };
}
