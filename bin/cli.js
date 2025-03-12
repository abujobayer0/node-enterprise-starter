#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import logSymbols from "log-symbols";

const REPO_URL = "https://github.com/abujobayer0/node-enterprise-starter";

const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(logSymbols.error, chalk.red(error.message));
    process.exit(1);
  }
};

const askForProjectName = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      default: "express-server",
      validate: (input) => input.length > 0 || "Project name cannot be empty.",
    },
  ]);
  return answers.projectName;
};

const askForPackageManager = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "packageManager",
      message: "Which package manager would you like to use?",
      choices: ["npm", "yarn", "bun"],
      default: "npm",
    },
  ]);
  return answers.packageManager;
};

const cloneRepository = (destination) => {
  console.log(chalk.cyan(`\n🚀 Cloning repository: ${REPO_URL}\n`));
  runCommand(`git clone ${REPO_URL} ${destination}`);
  console.log(
    logSymbols.success,
    chalk.green("Repository cloned successfully!")
  );
};

const removeBinFolder = (destination) => {
  const binPath = path.join(destination, "bin");
  if (fs.existsSync(binPath)) {
    fs.rmSync(binPath, { recursive: true, force: true });
  }
};

const removeBinFieldFromPackageJson = (destination) => {
  const packageJsonPath = path.join(destination, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    if (packageJson.bin) {
      delete packageJson.bin;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }
  }
};

const installDependencies = (packageManager, destination) => {
  console.log(
    chalk.yellow(`\n🔧 Installing dependencies using ${packageManager}...\n`)
  );
  runCommand(`cd ${destination} && ${packageManager} install`);
  console.log(
    logSymbols.success,
    chalk.green("Dependencies installed successfully!")
  );
  removeBinFolder(destination);
  removeBinFieldFromPackageJson(destination);
};

const main = async () => {
  console.log(chalk.blue("Welcome to Express Setup CLI!"));

  const projectName = await askForProjectName();
  const currentDir = process.cwd();
  const destination = path.join(currentDir, projectName);

  cloneRepository(destination);

  const packageManager = await askForPackageManager();
  installDependencies(packageManager, destination);

  console.log(chalk.green("\n🎉 Your Express project is ready!"));
  console.log(chalk.cyan(`cd ${projectName} && ${packageManager} run dev`));
};

main();
