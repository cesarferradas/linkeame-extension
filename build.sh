#!/bin/bash

zip -r -FS ./extension.zip * --exclude '*.git*' '*.sh' '.*' package.json
