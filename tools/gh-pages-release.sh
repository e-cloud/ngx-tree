#!/usr/bin/env bash

yarn docs:build
currentBranch=`git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`
git checkout gh-pages
git add -A
git commit -m "docs update"
git checkout $currentBranch
