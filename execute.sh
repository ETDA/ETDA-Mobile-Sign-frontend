#!/bin/bash

# Usage: execute.sh [WildFly mode] [configuration file]
#
# The default mode is 'standalone' and default configuration is based on the
# mode. It can be 'standalone.xml' or 'domain.xml'.

echo "=> Executing Customization script"

PROJECT=${1}
ENV=${2}
GIT_DOMAIN_GROUP=${3}
GIT_ACCESS_TOKEN=${4}

SIGNINGSERVER_CONFIG_PATH=/app

TMP_GIT=/tmp/${PROJECT}

function git_config() {
  echo "=> Start git configuration files"

  git clone "https://oauth2:${GIT_ACCESS_TOKEN}@${GIT_DOMAIN_GROUP}/${PROJECT}.git" "${TMP_GIT}"
  cp -p "${TMP_GIT}/${ENV}/.env" "${SIGNINGSERVER_CONFIG_PATH}"

  echo "=> Finish git configuration files"
}

function start_signingserver() {

  echo "=> Starting RUN Document Server"
  
  #yarn run start
  npm run build
  
  echo "=> RUN Document Server SUCCESS"
}

# Main
git_config
start_signingserver
# End Main

