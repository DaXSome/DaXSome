import { algoliasearch } from 'algoliasearch';
import Papa from 'papaparse';


export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
);


/**
 * Given a dataset name, return the slug version of the name. This is done by replacing all spaces with underscores.
 * @param name The dataset name to parse.
 * @returns The slug version of the dataset name.
 */
export const parseDatasetSlug = (name: string) => {
    return name.toLowerCase().replaceAll(' ', '_');
};

/**
 * Given a dataset slug, return the normalized version of the slug. This is done by replacing all underscores with spaces.
 * @param slug The dataset slug to normalize.
 * @returns The normalized dataset slug.
 */
export const normalizeDatasetSlug = (slug: string) => {
    return slug.toLowerCase().replaceAll('_', ' ');
};

export const jsonToCsv = (json: Record<string, unknown>[]): string => {
    if (!json.length) return '';

    const headers = Object.keys(json[0]);
    const csvRows = json.map((row) =>
        headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
    );

    return [headers.join(','), ...csvRows].join('\n');
};

export const readFile = (file: File | undefined) => {
    if (!file) return Promise.reject('Missing file');

    return new Promise<{
        headers: Array<{ name: string; type: string }>;
        data: Array<Record<string, unknown>>;
    }>((resolve, reject) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const reader = new FileReader();

        if (ext === 'json') {
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target?.result as string);
                    if (!Array.isArray(jsonData))
                        return reject('Invalid JSON format');

                    const headers = Object.keys(jsonData[0]).map((name) => ({
                        name,
                        type: typeof jsonData[0][name],
                    }));

                    resolve({ data: jsonData, headers });
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        } else if (ext === 'csv') {
            let headers: Array<{ name: string; type: string }> = [];
            const data: Array<Record<string, unknown>> = [];

            Papa.parse<typeof data[number]>(file, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                step: (row) => {
                    if (!headers.length) {
                        headers = Object.keys(row.data).map((name) => ({
                            name,
                            type: typeof row.data[name],
                        }));
                    }
                    data.push(row.data);
                },
                complete: () => resolve({ data, headers })
                ,
                error: (error) => reject(error.message),
            });
        } else {
            reject('Unsupported file type');
        }
    });
};

export const HOST_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://daxsome.org';

export const supportedDataTypes = ['string', 'number', 'boolean'];

export const colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#d0ed57',
    '#8dd1e1',
    '#a4de6c',
    '#d084d8',
    '#f3a683',
    '#ff6f61',
    '#2ec4b6',
    '#e71d36',
    '#011627',
    '#ff9f1c',
    '#6a4c93',
    '#d90368',
    '#bc5090',
    '#ff6361',
    '#ffa600',
    '#003f5c',
    '#7a5195',
    '#ef5675',
    '#ffa07a',
    '#4682b4',
    '#b0e57c',
    '#ffb3ba',
    '#bae1ff',
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#e67e22',
    '#e74c3c',
    '#2ecc71',
    '#f39c12',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#f1c40f',
    '#d35400',
    '#c0392b',
    '#7f8c8d',
    '#34495e',
    '#2c3e50',
    '#5dade2',
    '#ec7063',
    '#af7ac5',
    '#45b39d',
    '#f5cba7',
    '#5d6d7e',
    '#eb984e',
    '#abebc6',
    '#85c1e9',
    '#f1948a',
];
