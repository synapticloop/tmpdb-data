import fs from 'fs';
import * as path from "node:path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * List all directories in the `directoryPath` directory
 *
 * @param {string} directoryPath The directory path
 * @returns {string[]} The list of directories in the directory path
 */
export function listDirectories(directoryPath: string): string[] {
	return fs.readdirSync(directoryPath, {withFileTypes: true})
			.filter(directoryEntry => directoryEntry.isDirectory())
			.map(directoryEntry => directoryEntry.name);
}

/**
 * List all files with the extension
 *
 * @param directoryPath the directory path
 * @param dotExtension the dot extension - default ".json", for all files use
 *        an empty string - ""
 */
export function listFiles(directoryPath:string, dotExtension:string=".json") {
	return fs.readdirSync(directoryPath, {withFileTypes: true})
			.filter(fileEntry => {
				return(fileEntry.isFile() && fileEntry.name.endsWith(dotExtension));
			})
			.map(fileEntry => fileEntry.name);
}