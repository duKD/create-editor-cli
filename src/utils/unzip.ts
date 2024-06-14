import AdmZip from "adm-zip";
import { unlinkSync, renameSync } from "fs";
import path from "path";

const templateName = {
  vue: "vue3-picture-editor-main",
  react: "react-picture-editor-main",
};

export default function unzip(
  targetDir: string,
  tempFilePath: string,
  projectName: string,
  type: "vue" | "react"
) {
  try {
    const zip = new AdmZip(tempFilePath);
    zip.extractAllTo(targetDir, true);
    const oldFilePath = path.join(targetDir, templateName[type]);
    const newFilePath = path.join(targetDir, projectName);
    renameSync(oldFilePath, newFilePath);
    unlinkSync(tempFilePath);
  } catch (error) {
    console.log("解压文件出错", error);
  }
}
