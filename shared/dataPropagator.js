"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const ts_morph_1 = require("ts-morph");
const sourceDataPaths = ['dto-types.ts', 'message-types.ts', 'type-guard-functions.ts', 'utility-functions.ts', 'message-topics.ts'];
const configPath = 'config.json';
const outputSuffixPath = 'src/shared-definitions';
const outputFileName = 'types-dto-constants.ts';
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const project = new ts_morph_1.Project();
sourceDataPaths.forEach((dataFilePath) => project.addSourceFileAtPath(`./core/${dataFilePath}`));
Object.entries(config).forEach(([microserviceName, microserviceConfig]) => {
    const outputPathToFolder = `../${microserviceName}/${outputSuffixPath}`;
    verifyOutputFolderExists(outputPathToFolder);
    fs.rmSync(`${outputPathToFolder}/${outputFileName}`);
    Object.entries(microserviceConfig).forEach(([dataType, elements]) => {
        project.getSourceFiles().forEach((sharedDataFile) => {
            if (sourceDataPaths.includes(sharedDataFile.getBaseName())) {
                const content = generateContentForMicroservice(elements, sharedDataFile);
                fs.writeFileSync(`${outputPathToFolder}/${outputFileName}`, content, { flag: 'as' });
                console.log(`Generated TypeScript file for ${dataType} at ${outputPathToFolder}/${sharedDataFile.getBaseName()}`);
            }
        });
    });
});
function generateContentForMicroservice(elements, sharedDataFile) {
    let content = '';
    elements.forEach((element) => {
        const found = sharedDataFile.getInterface(element) ||
            sharedDataFile.getTypeAlias(element) ||
            sharedDataFile.getVariableStatement(element) ||
            sharedDataFile.getFunction(element) ||
            sharedDataFile.getEnum(element);
        if (found) {
            content += found.getText() + '\n';
        }
    });
    return content;
}
function verifyOutputFolderExists(outputPathToFolder) {
    if (!fs.existsSync(outputPathToFolder)) {
        fs.mkdirSync(outputPathToFolder, { recursive: true });
    }
}
console.log('Typescript files generated.');
