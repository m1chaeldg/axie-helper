const cache: { [key: string]: any } = {};

export const memoize = async (handler: () => Promise<any>, arg: string) => {
    if (cache.hasOwnProperty(arg)) {
        return cache[arg];
    }
    const value = await handler();
    cache[arg] = value;
    return value;
};