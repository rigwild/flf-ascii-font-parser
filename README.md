# flf-ascii-font-parser
A simple Node.js script to parse .flf files (Figlet Font File) to json.

## Usage
Put your `.flf` files in a directory called `./toConvert/` next to the script.

    $ node index.js

The parsed data will be in the `./converted/` directory in json format.

The script will not parse `.flf` files if a file with the same name in `.json` is
present in the `./converted/` directory.

## Options

`--override` : Parse all files even if present in the `./converted/`
directory.

    $ node index.js --override

## LICENSE
[MIT](https://github.com/rigwild/flf-ascii-font-parser/blob/master/LICENSE)
