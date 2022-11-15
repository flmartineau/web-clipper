#!/bin/bash

if [ ! -e node_modules ]; then
  mkdir node_modules
fi

case $(uname -s) in
MINGW*)
  USER_UID=1000
  GROUP_UID=1000
  ;;
*)
  if [ -z ${USER_UID:+x} ]; then
    USER_UID=$(id -u)
    GROUP_GID=$(id -g)
  fi
  ;;
esac


buildYarn() {
  case $(uname -s) in
  MINGW*)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn config set "strict-ssl" false -g && yarn install --network-timeout 100000"
    ;;
  *)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn config set "strict-ssl" false -g && yarn install --network-timeout 100000"
    ;;
  esac
}

compileDev() {
  case $(uname -s) in
  MINGW*)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn dev"
    ;;
  *)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn dev"
    ;;
  esac
}

makeRelease() {
  case $(uname -s) in
  MINGW*)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn release"
    ;;
  *)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn release"
    ;;
  esac
}

for param in "$@"; do
  case $param in
  install)
    buildYarn && compileDev
    ;;
  dev)
    compileDev
    ;;
  release)
    makeRelease
    ;;
  esac
   if [ ! $? -eq 0 ]; then
      exit 1
    fi
  done
