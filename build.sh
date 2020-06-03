#!/usr/bin/env bash

zip -r -FS ../linkeame-extension.zip * --exclude '*.git*' '*.sh' '.*' package.json
