#!/bin/sh
cd "$(dirname "$0")/../backend" || exit 1
npm run smtp:test -- waliulrayhan@gmail.com
