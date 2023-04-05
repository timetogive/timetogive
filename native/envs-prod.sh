#!/usr/bin/env bash
export $(grep -v '^#' .env.prod | xargs)