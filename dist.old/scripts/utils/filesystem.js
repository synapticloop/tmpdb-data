import fs from 'fs';
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
export function listDirectories(directoryPath) {
    return fs.readdirSync(directoryPath, { withFileTypes: true })
        .filter(directoryEntry => directoryEntry.isDirectory())
        .map(directoryEntry => directoryEntry.name);
}
export function listFiles(directoryPath) {
    return fs.readdirSync(directoryPath, { withFileTypes: true })
        .filter(fileEntry => {
        return (fileEntry.isFile() && fileEntry.name.endsWith(".json"));
    })
        .map(fileEntry => fileEntry.name);
}
//# sourceMappingURL=filesystem.js.map