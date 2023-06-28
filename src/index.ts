import { DoodVideo } from './dood';
import { extractDoodMetadata } from './extract';

export const fetchDoodVideo = async (id: string): Promise<DoodVideo> => {
    const url   = new URL(`./d/${encodeURIComponent(id)}`, 'https://dooood.com');
    const heads = new Headers();

    heads.set('Origin', url.origin);
    heads.set('Referer', url.origin + '/');
    heads.set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:98.0) Gecko/20100101 Firefox/98.0');

    const response = await fetch(url, {
        headers: heads,
    });

    return extractDoodMetadata(response);
}
