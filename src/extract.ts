import type { DoodVideo } from './dood';

export const extractDoodMetadata = async (response: Response): Promise<DoodVideo> => {
    const state: DoodVideo = {
        date: '',
        duration: '',
        size: '',
        title: '',
    }

    const rewrite = new HTMLRewriter();
    return await new Promise(async (resolve, reject) => {
        const resolveOnComplete = (forceExist = false) => {
            if (forceExist) {
                return reject(new Error('Video not found'));
            } else if (
                state.date.length &&
                state.duration.length &&
                state.size.length &&
                state.title.length
            ) {
                return resolve(state);
            }
        }

        rewrite
        .on('title', {
            text(text) {
                if (/video not found/gi.test(text.text.trim())) {
                    return resolveOnComplete(true);
                } else if (/just a moment/gi.test(text.text.trim())) {
                    return reject(new Error('Cloudflare issue'));
                }
            },
        }).on('div.info > h4', {
            text(text) {
                Reflect.set(state, 'title', text.text.trim());
                resolveOnComplete();
            },
        }).on('div.length', {
            text(textEl) {
                Reflect.set(state, 'duration', textEl.text.trim());
                resolveOnComplete();
            },
        }).on('div.size', {
            text(text) {
                Reflect.set(state, 'size', text.text.trim());
                resolveOnComplete();
            },
        }).on('div.uploadate', {
            text(text) {
                Reflect.set(state, 'date', text.text.trim());
                resolveOnComplete();
            },
        });


        rewrite.transform(response);
    });
}