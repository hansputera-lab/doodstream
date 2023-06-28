import { expect, test } from 'bun:test';
import { fetchDoodVideo } from '../src';

test('Metadata', async () => {
    const result = await fetchDoodVideo('zacnasd0l82w');
    console.log(result);
    expect(result).not.toBeUndefined();
});
