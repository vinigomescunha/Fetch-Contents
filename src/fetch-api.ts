import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { DEFAULT_APIS_FETCH_FOLDER } from './default';
import { ConnectorApis } from './connector-api';

const getFileJson = (dirName: string, file: string) => {
    const filePath = path.resolve(__dirname, dirName, file);
    if (fs.existsSync(filePath)) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
};
const getAllFilesFromFolder = (folder: string): string[] => fs.readdirSync(folder);
/**
 * @param dir 
 */
export const bundleFetch = async (dir?: string) => {
    const dirName = !dir ? DEFAULT_APIS_FETCH_FOLDER: dir;
    const apisOutputAsPromise: Promise<any>[] = getAllFilesFromFolder(path.resolve(__dirname, dirName)).map(f => {
        return ConnectorApis.build(getFileJson(path.resolve(__dirname, dirName), f));
    });
    return await Promise.all(apisOutputAsPromise);
};
/**
 * fetch data from local or remote source
 * @param source where is the resource type: local| remote; href: resource uri
 */
export const fetchFrom = async (source: { type: string; href: string; }) => {
    switch (source.type) {
        case 'local':
            return getFileJson(".", source.href);
        case 'remote':
            return (await axios.get(source.href)).data;
        default:
            return null;
    }
};
