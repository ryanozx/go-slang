# go-slang

Open-source implementations of a sublanguage of Go in TypeScript

## Table of Contents

- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Documentation](#documentation)
- [Requirements](#requirements)
- [Testing](#testing)
- [Error messages](#error-messages)
- [Using your js-slang in Source Academy](#using-your-js-slang-in-source-academy)
- [Using your js-slang in your local Source Academy](#using-your-js-slang-in-your-local-source-academy)
- [Building and publishing SICP package](#building-and-publishing-sicp-package)
- [Talks and Presentations](#talks-and-presentations)
- [License](#license)

## Prerequisites

- NodeJS v20
- Python: On MacBook Pro with chip Apple M1 Pro, use python 3.10.12. Here is [the correct way to set Python 3 as default on a Mac](https://opensource.com/article/19/5/python-3-default-mac).

## Usage

To build,

```bash
$ git clone --recurse-submodules https://github.com/ryanozx/go-slang
$ cd go-slang
$ yarn
$ yarn build
```

To use the sublanguage,
1. Set up the backend parser server ([link to backend parser server](https://github.com/audd-ho/goslang-backend))
2. Create a .env file in the root of the module. (Refer to .env.example). This .env file will contain the URL
of the backend server
3. If you are hosting the backend parser server on a different URL, modify the environment variable accordingly
4. Once the server is set up, pass your code into parseCompileAndRunGo() in "src/go-slang/index.ts"

Tests can be found at "src/go-slang/interpreter/__tests". To run them, execute "ts-node [test_file_name]" in the console.

A brief description of each test, its purpose, and expected output (more detailed explanations can be found
within the test files themselves):

|Test | Purpose | Expected Output|
|---|---|---|
|channel_2routines_badorder.ts| Demonstrate send and receive blocking ability of unbuffered channels when they are done in the wrong order | VM does not terminate |
|channel_2routines_goodorder.ts| Demonstrate send and receive not blocking in unbuffered channels when they are done in the correct order (receiver present before sender can send) | Prints 1, then 2 |
| channel_buffered_block_receive.ts | Receiving from a buffered empty channel is blocking | No output printed, VM does not terminate |
| channel_buffered_full_block.ts | Sending to a full buffered channel is a blocking operation | VM does not terminate as busy waiting occurs |
| channel_buffered_full_noblock.ts | Sending to a buffered channel is non-blocking when the buffer is not full | VM terminates after sending 5 values (channel has capacity 5) |
| channel_buffered_noblock_send.ts | Sending to a buffered channel does not require a receiver to be present i.e. does not block assuming non-full channel | VM terminates after sending 1 value |
| channel_close_test.ts | After a channel is closed and all its values are read, it will return the default zero value for any further reads | VM prints 1, 3, 5, 0 (default zero value) and terminates |
| channel_send_to_closed_channel.ts | Sending to a closed channel causes a panic | Error message printed when sending to a closed channel |
| channel_unbuffered_block_receive.ts | Receiving from a closed unbuffered channel is a blocking operation | VM does not terminate |
| channel_unbuffered_block_send.ts | Sending to an unbuffered channel without a receiver is a blocking operation | VM does not terminate |
| channel2_routines3_block_wait.ts | Channels can be used to enforce execution order amongst goroutines, depending on sending/receiving availability | 232 is printed first, then 111 and 323 (order for the last 2 may not be fixed) |
| gc_test.ts | Garbage collector executes when memory used is twice that at the end of the last GC cycle; tests that GC does free memory | Several lines of output indicating GC execution, as well as before and after memory use |
| goroutine_test.ts | Demonstrates interleaving ability of goroutines due to scheduler | "Thread 1", "Thread 2",
and "Main" should interleave each other in the output |
| semaphore_test.ts | Semaphores can be used to protect critical sections, ensuring only one goroutine can execute the critical section at any time | Sequence of "1"s, "2"s, "3"s are printed disjointly as only one goroutine has access to the for loop at any time |
| string_test.ts | Demonstrates ability to print and concatenate strings | Prints "abc", "def", "abcdef" (concatenation), and "abcabc" (reassignment) |
| waitGroup_test.ts | Wait Groups can be used to synchronise Goroutines | Prints "f DONE" twice before printing "Main done" (main goroutine waits for child goroutines to finish execution first before printing) |


This repository uses git submodules. To update existing repositories with a submodule,

```bash
# Init is only required on the very first time.
$ git submodule update --init --recursive
# Required subsequently every time you want to update the submodules.
$ git submodule update --recursive --remote
```

To add \"js-slang\" to your PATH, build it as per the above instructions, then run

```bash
$ cd dist
$ npm link
```

If you do not wish to add \"js-slang\" to your PATH, replace \"js-slang\" with \"node dist/repl/repl.js\" in the following examples.

To try out _Source_ in a REPL, run

```bash
$ js-slang -c [chapter] # default: 1
```

You can set additional options:

```{.}
Usage: js-slang [PROGRAM_STRING] [OPTION]

  -c, --chapter=CHAPTER set the Source chapter number (i.e., 1-4)                                                              (default: 1)
  -v, --variant=VARIANT set the Source variant (i.e., default, interpreter, substituter, typed, lazy, non-det, concurrent, wasm, gpu) (default: default)
  -h, --help            display this help
  -e, --eval            don't show REPL, only display output of evaluation
```

Currently, valid CHAPTER/VARIANT combinations are:

- `--chapter=1 --variant=default`
- `--chapter=1 --variant=wasm`
- `--chapter=1 --variant=lazy`
- `--chapter=1 --variant=substituter`
- `--chapter=1 --variant=interpreter`
- `--chapter=1 --variant=typed`
- `--chapter=2 --variant=default`
- `--chapter=2 --variant=lazy`
- `--chapter=2 --variant=substituter`
- `--chapter=2 --variant=interpreter`
- `--chapter=2 --variant=typed`
- `--chapter=3 --variant=default`
- `--chapter=3 --variant=concurrent`
- `--chapter=3 --variant=non-det`
- `--chapter=3 --variant=interpreter`
- `--chapter=3 --variant=typed`
- `--chapter=4 --variant=default`
- `--chapter=4 --variant=gpu`
- `--chapter=4 --variant=interpreter`

Hint: In `bash` you can take the `PROGRAM_STRING` out of a file as follows:

```bash
$ js-slang -n --chapter=1 -e "$(< my_source_program.js)"
```

## Documentation

Source is documented here: <https://docs.sourceacademy.org/>

### Requirements

- `bash`: known working version: GNU bash, version 5.0.16
- `latexmk`: Version 4.52c
- `pdflatex`: known working versions
  - pdfTeX 3.14159265-2.6-1.40.18 (TeX Live 2017)

To build the documentation, run

```bash
$ git clone https://github.com/source-academy/js-slang.git
$ cd js-slang
$ yarn
$ yarn install
$ yarn jsdoc  # to make the web pages in js-slang/docs/source
$ cd docs/specs
$ make        # to make the PDF documents using LaTeX
```

**Note:** The documentation may not build on Windows, depending on your bash setup, [see above](https://github.com/source-academy/js-slang#requirements).

Documentation on the Source libraries are generated from inline documentation in the library sources, a copy of which are kept in `docs/lib/*.js`. The command `yarn jsdoc` generates the documentation and places it in the folder `docs/source`. You can test the documentation using a local server:

```bash
$ cd docs/source;  python -m http.server 8000
```

Documentation of libraries is displayed in autocomplete in the frontend. This documentation is generated by `./scripts/updateAutocompleteDocs.py` and placed in `src/editors/ace/docTooltip/*.json` files. This script is run by `yarn build`prior to`tsc`. To add a Source variant to the frontend autocomplete, edit `src/editors/ace/docTooltip/index.ts` and`./scripts/updateAutocompleteDocs.py`.

## Testing

`js-slang` comes with an extensive test suite. To run the tests after you made your modifications, run `yarn test`. Regression tests are run automatically when you want to push changes to this repository. The regression tests are generated using `jest` and stored as snapshots in `src/\_\_tests\_\_`. After modifying `js-slang`, carefully inspect any failing regression tests reported in red in the command line. If you are convinced that the regression tests and not your changes are at fault, you can update the regression tests as follows:

```bash
$ yarn test -- --updateSnapshot
```

## Error messages

To enable verbose messages, have the statement `"enable verbose";` as the first line of your program. This also causes the program to be run by the interpreter.

There are two main kinds of error messages: those that occur at runtime and those that occur at parse time. The first can be found in `interpreter-errors.ts`, while the second can be found in `rules/`.

Each error subclass will have `explain()` and `elaborate()`. Displaying the error will always cause the first to be called; the second is only called when verbose mode is enabled. As such, `explain()` should be made to return a string containing the most basic information about what the error entails. Any additional details about the error message, including specifics and correction guides, should be left to `elaborate()`.

Please remember to write test cases to reflect your added functionalities. The god of this repository is self-professed to be very particular about test cases.

## Using your js-slang in Source Academy

js-slang is used by the [Source Academy](https://sourceacademy.org), the immersive online experiential environment for learning programming. For this, js-slang is [deployed as an NPM package](https://www.npmjs.com/package/js-slang). The frontend of the Source Academy then includes the js-slang package in its deployment bundle.

## Using your js-slang in your local Source Academy

A common issue when developing modifications to js-slang is how to test it using your own local frontend. Assume that you have built your own frontend locally, here is how you can make it use your own js-slang, instead of the one that the Source Academy team has deployed to npm.

First, build and link your local js-slang:

```bash
$ cd js-slang
$ yarn build
$ yarn link
```

Then, from your local copy of frontend:

```bash
$ cd frontend
$ yarn link "js-slang"
```

Then start the frontend and the new js-slang will be used.

## Building and publishing SICP package

To build SICP package

```bash
$ cd js-slang
$ yarn
$ yarn build_sicp_package
```

To publish SICP package, update version number in `sicp_publish/package.json`

```bash
$ cd js-slang/sicp_publish
$ npm publish
```

## Talks and Presentations

- **How `js-slang` works under the hood** (17th Jan 2023 – The Gathering) ([slides](https://docs.google.com/presentation/d/1GFR39iznBZxWv948zUsmcbCSSDasm4xYs3Jc5GF7A3I/edit?usp=sharing))

## License

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

All sources in this repository are licensed under the [Apache License Version 2][apache2].

[apache2]: https://www.apache.org/licenses/LICENSE-2.0.txt
