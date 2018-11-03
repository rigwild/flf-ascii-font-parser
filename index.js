'use strict'

const fs = require('fs')

const sourceDir = './toConvert/'
const outputDir = './converted/'

const regex = /@@\n([\s\S]*?)@@/gm

// All characters in a .flf file in the order of the official specification
// prettier-ignore
const specificationCharOrder = ['!','"','#','$','%','&','\'','(',')','*','+',',','-','.','/','0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?','@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_','`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','{','|','}','~','Ä','Ö','Ü','ä','ö','ü','ß']

// Create needed directories
const createDir = () => {
  if (!fs.existsSync(sourceDir)) fs.mkdirSync(sourceDir)
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
}

// Get files from source directory not present in output directory (except if --override option is present)
const getFiles = () => {
  const sourceFiles = fs.readdirSync(sourceDir)
  const outputFiles = fs.readdirSync(outputDir)
  console.log(process.argv)
  return process.argv.length >= 3 && process.argv[2] === '--override'
    ? sourceFiles
    : sourceFiles.filter(x => !outputFiles.find(y => y === x.replace('.flf', '.json')))
}

// Parse a .flf file
const parseFile = file => {
  if (!fs.existsSync(sourceDir + file)) throw new Error(`File ${sourceDir + file} does not exist.`)

  const content = fs.readFileSync(sourceDir + file, { encoding: 'utf-8' })
  let data
  let letters = []

  let count = 0
  // Separate all chars
  while ((data = regex.exec(content))) {
    // Check if char is available
    if (count > specificationCharOrder.length - 1) break

    if (data.length > 1) data = data[1]

    //Cleaning the letter
    data = data
      .split('@\n')
      .map(x => x.replace(/\@$/g, '').replace(/(^\$|^\$|\$$)/g, ''))
      .join('\n')

    letters.push({ letter: specificationCharOrder[count], ascii: data })

    // Getting back 2 chars in the exec lastIndex (ending @@ is matched)
    regex.lastIndex -= 2
    count++
  }
  return letters
}

// Safe data to json file
const saveFile = (file, content) => {
  try {
    content = JSON.stringify(content)
    fs.writeFileSync(outputDir + file.replace('.flf', '.json'), content)
  } catch (e) {
    throw new Error('Invalid JSON input.')
  }
}

const setup = () => {
  createDir()
  const files = getFiles()
  const parsed = files.map(x => ({ file: x, data: parseFile(x) }))
  parsed.forEach(x => saveFile(x.file, x.data))
}

setup()
