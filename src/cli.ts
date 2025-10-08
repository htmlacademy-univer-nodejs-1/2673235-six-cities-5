#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import { parseTsvLine } from './utils/tsv.js';

function showHelp(): void {
  console.log(chalk.cyan.bold('Программа для подготовки данных для REST API сервера.'));
  console.log('');
  console.log(chalk.gray('Пример: cli.js --<command> [--arguments]'));
  console.log('');
  console.log('Команды:');
  console.log(`    ${ chalk.green('--version') }           # номер версии`);
  console.log(`    ${ chalk.green('--help') }              # этот текст`);
  console.log(`    ${ chalk.green('--import <path>') }     # импорт из TSV`);
  console.log('');
}

async function readVersion(): Promise<string> {
  try {
    const pkgPath = new URL('../package.json', import.meta.url);
    const raw = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw);
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function importTsv(filePath: string): Promise<void> {
  const exists = await fs.access(filePath).then(() => true).catch(() => false);

  if (!exists) {
    console.error(chalk.red(`Файл не найден: ${filePath}`));
    process.exitCode = 1;
    return;
  }

  const rl = readline.createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity
  });

  let imported = 0;
  let headerSkipped = false;

  console.log(chalk.blueBright(`Импорт из: ${filePath}\n`));

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    if (trimmed.startsWith('#')) {
      continue;
    }

    if (!headerSkipped) {
      headerSkipped = true;
      continue;
    }

    const offer = parseTsvLine(trimmed);
    imported += 1;

    console.log(
      chalk.bold(offer.title),
      chalk.gray(`[${offer.city}]`),
      chalk.yellow(`€${offer.price}`),
      chalk.gray(`(${offer.type}, rating ${offer.rating})`)
    );
  }

  console.log(`\n${ chalk.cyan.bold(`Итого импортировано: ${imported}`)}`);
}

async function main(argv: string[]): Promise<void> {
  const args = argv.slice(2);

  if (args.length === 0) {
    showHelp();
    return;
  }

  const cmd = args[0];

  if (cmd === '--help') {
    showHelp();
    return;
  }

  if (cmd === '--version') {
    const v = await readVersion();
    console.log(chalk.magenta(v));
    return;
  }

  if (cmd === '--import') {
    const path = args[1];

    if (!path) {
      console.error(chalk.red('Укажите путь к TSV файлу: --import <path>'));
      process.exitCode = 1;
      return;
    }

    await importTsv(path);
    return;
  }

  console.error(chalk.red(`Неизвестная команда: ${cmd}`));
  showHelp();
  process.exitCode = 1;
}

main(process.argv).catch((err) => {
  console.error(chalk.red('Необработанная ошибка:'), err);
  process.exitCode = 1;
});
