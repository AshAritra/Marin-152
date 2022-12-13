const axios = require('axios');
const fs = require('fs-extra');
const _ = require('lodash');
const log = require('./logger/log.js');
const chalk = require('chalk');


(async () => {
	const { data: versions } = await axios.get('https://raw.githubusercontent.com/AshAritra/Marin-152/main/versions.json');
	const currentVersion = require('./package.json').version;
	const versionsNeedToUpdate = versions.slice(versions.findIndex(v => v.version === currentVersion) + 1);
	if (versionsNeedToUpdate.length === 0)
		return log.info("SUCCESS", "You have already the latest version of Marin-152");

	fs.writeFileSync(`${process.cwd()}/versions.json`, JSON.stringify(versions, null, 2));
	log.info("UPDATE", "There are %1 new versions to update, starting to update...", chalk.yellow(versionsNeedToUpdate.length));

	for (const version of versionsNeedToUpdate) {
		log.info("UPDATE", `Update version ${version.version}`);
		const { files, deleteFiles } = version;

		for (const filePath in files) {
			const description = files[filePath];
			const fullPath = `${process.cwd()}/${filePath}`;
			const { data: getFile } = await axios.get(`https://github.com/AshAritra/Marin-152/raw/main/${filePath}`, {
				responseType: 'arraybuffer'
			});

			if (filePath === "config.js") {
				const currentConfig = require('./config.js');
				for (const key in files[filePath]) {
					const value = files[filePath][key];
					if (typeof value == "string" && value.startsWith("DEFAULT_")) {
						const keyOfDefault = value.replace("DEFAULT_", "");
						_.set(currentConfig, key, _.get(currentConfig, keyOfDefault));
					}
					else
						_.set(currentConfig, key, files[filePath][key]);
				}

				if (fs.existsSync(`${process.cwd()}/config.backup.js`)) {
					let backupConfig = 1;
					while (fs.existsSync(`${fullPath.slice(0, -5)}_${backupConfig}.backup.js`))
						backupConfig++;
					fs.copyFileSync(fullPath, `${fullPath.slice(0, -5)}_${backupConfig}.backup.js`);
				}
				else {
					fs.copyFileSync(fullPath, `${process.cwd()}/config.backup.js`);
				}
				fs.writeFileSync(fullPath, JSON.stringify(currentConfig, null, 2));
				console.log(chalk.bold.blue('[↑]'), `${filePath}`);
				// warning config.json is changed
				console.log(chalk.bold.yellow('[!]'), "Config.js changed please check it!");
			}
			else if (fs.existsSync(fullPath)) {
				fs.writeFileSync(fullPath, Buffer.from(getFile));
				console.log(chalk.bold.blue('[↑]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
			else {
				const cutFullPath = filePath.split('/');
				cutFullPath.pop();
				for (let i = 0; i < cutFullPath.length; i++) {
					const path = `${process.cwd()}/${cutFullPath.slice(0, i + 1).join('/')}`;
					if (!fs.existsSync(path))
						fs.mkdirSync(path);
				}
				fs.writeFileSync(fullPath, Buffer.from(getFile));
				console.log(chalk.bold.green('[+]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
		}

		for (const filePath in deleteFiles) {
			const description = deleteFiles[filePath];
			const fullPath = `${process.cwd()}/${filePath}`;
			if (fs.existsSync(fullPath)) {
				fs.unlinkSync(fullPath);
				console.log(chalk.bold.red('[-]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
		}
	}

	const { data: packageJson } = await axios.get("https://github.com/AshAritra/Marin-152/raw/main/package.json");
	fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(packageJson, null, 2));
	log.info("UPDATE", "Update successfully ✓");
})();
