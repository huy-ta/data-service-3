import fs from 'fs';

class FileUtils {
  public static isDirectory(path: string): boolean {
    return fs.lstatSync(path).isDirectory();
  }
}

export default FileUtils;