import axios from "axios";
import path from "node:path";
import fs from "node:fs";
import progress from "progress";
import { red } from "kolorist";

const zipUrl = {
  vue: "https://github.com/duKD/vue3-picture-editor/archive/refs/heads/main.zip",
  react:
    "https://github.com/duKD/react-picture-editor/archive/refs/heads/main.zip",
};

const codeError = "ECONNREFUSED";

export default async function createProject(
  tempFilePath: string,
  type: "vue" | "react"
) {
  try {
    const res = await axios.get(zipUrl[type], {
      responseType: "stream",
    });

    const writer = fs.createWriteStream(tempFilePath);
    res.data.pipe(writer);
    const totalLength = parseInt(res.headers["content-length"], 10) || 454306;

    const progressBar = new progress(":bar :percent ", {
      complete: "=",
      incomplete: " ",
      width: 100,
      total: totalLength,
    });

    await new Promise((resolve, reject) => {
      res.data.on("data", (chunk: any) => progressBar.tick(chunk.length));
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error: any) {
    if (codeError === error.code) {
      console.log(red("网络不好，连接错误！ 请用梯子"));
    } else {
      console.log(error);
    }
  }
}
