import * as fs from 'fs';
import { Project } from 'ts-morph';

interface MicroserviceConfig {
  [microserviceName: string]: {
    [dataType: string]: string[]
  };
}

const sourceDataPaths = ['dto-types.ts', 'message-types.ts', 'type-guard-functions.ts', 'utility-functions.ts', 'message-topics.ts'];
const configPath = 'config.json';
const outputSuffixPath = 'src/dto';
const outputFileName = 'types-dto-constants.ts';

const config: MicroserviceConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const project = new Project();
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

function generateContentForMicroservice(elements: string[], sharedDataFile: any) {
  let content = '';
  
  elements.forEach((element) => {
    const found =
      sharedDataFile.getInterface(element) ||
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

function verifyOutputFolderExists(outputPathToFolder: string) {
  if (!fs.existsSync(outputPathToFolder)) {
    fs.mkdirSync(outputPathToFolder, { recursive: true });
  }
}

console.log('Typescript files generated.');

