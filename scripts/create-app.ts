import { number, input } from "@inquirer/prompts";
import chalk from "chalk";
import * as path from "path";
import fs from "fs-extra";
import { exec } from "child_process";

async function promptAppDetails() {
  const appName = await input({
    message: "Enter name:",
    validate: (value: string) =>
      value.trim() !== "" || "App name cannot be empty",
  });
  const port = await number({
    message: "Enter port number:",
    min: 1000,
    max: 9999,
    required: true,
  });
  return { appName, port } as { appName: string; port: number };
}

async function installDeps(appName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(chalk.cyan(`Installing dependencies for ${appName}...\n`));

    exec(`pnpm i -F ${appName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          chalk.red(`Error installing dependencies for ${appName}: ${stderr}`)
        );
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

async function main() {
  const packagePrefix = "@mono/";
  try {
    const { appName, port } = await promptAppDetails();
    const packageName = `${packagePrefix}${appName}`;
    const templateDir = path.join(process.cwd(), ".templates", "app-template");
    const targetDir = path.join(process.cwd(), "packages", "apps", appName);

    console.log(chalk.cyan(`\nCreating package ${packageName}...`));
    await fs.copy(templateDir, targetDir);

    const packageJsonPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJSON(packageJsonPath);
    pkg.name = packageName;
    await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 });

    const rsbuildConfigPath = path.join(targetDir, "rsbuild.config.ts");
    let configContent = await fs.readFile(rsbuildConfigPath, "utf8");
    configContent = configContent
      .replace(/#{PORT}/g, port.toString())
      .replace(/#{APP_NAME}/g, appName);
    await fs.writeFile(rsbuildConfigPath, configContent, "utf8");
    console.log(chalk.green(`Created package ${packageName}`));

    await installDeps(packageName);
    console.log(chalk.green("Finished successfully"));
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

main();
