import fs from "node:fs";
import path from "node:path";
import { emptyDir, isValidPackageName } from "./utils/index";
import prompts from "prompts";
import { red } from "kolorist";
import createProject from "./utils/createProject";
import unzip from "./utils/unzip";

// 用于 获取命令行参数
// const argv = getParams();

// 当前工作目录
const cwd = process.cwd();

async function init() {
  const questions: Array<prompts.PromptObject> = [
    {
      type: "select",
      name: "type",
      initial: 0,
      choices: [
        {
          title: "vue",
          value: "vue",
        },
        {
          title: "react",
          value: "react",
        },
      ],
      message: "选择编辑器版本?",
    },
    {
      type: "text",
      name: "projectName",
      message: "输入项目名称",
    },
    {
      type: (projectName: string) =>
        isValidPackageName(projectName) ? null : "text",
      name: "projectName",
      message: "名称格式不符，请重新输入项目名！",
    },
    {
      type: (projectName: string) => {
        let filePath = path.join(cwd, projectName);
        return !fs.existsSync(filePath) ? null : "select";
      },
      name: "overwrite",
      message: red("已经存在同名文件夹！"),
      initial: 0,
      choices: [
        {
          title: "Remove existing files and continue",
          value: "yes",
        },
        {
          title: "Cancel operation",
          value: "no",
        },
      ],
    },
    {
      type: (_, { overwrite }: { overwrite?: string }) => {
        if (overwrite === "no") {
          throw new Error(red("✖") + " Operation cancelled");
        }
        return null;
      },
      name: "overwriteChecker",
    },
  ];

  const { type, projectName, overwrite } = await prompts(questions);

  const filePath = path.join(cwd, projectName);
  if (overwrite === "yes") {
    //清空文件夹
    emptyDir(filePath);
  }
  console.log("开始下载模版...");
  const templateName = projectName + ".zip";

  const tempFilePath = path.join(cwd, templateName);
  await createProject(tempFilePath, type);
  console.log("下载完成，开始解压...");
  unzip(cwd, tempFilePath, projectName, type);
  console.log("\n解压完成...");
}

init();
