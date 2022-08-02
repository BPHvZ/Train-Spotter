pipeline {
  agent any
  stages {
    stage('Prepare') {
      steps {
        nodejs('NodeJS 18.7.0') {
          sh '''corepack enable
yarn install'''
        }

      }
    }

    stage('Build and Test') {
      steps {
        nodejs('NodeJS 18.7.0') {
          sh 'yarn run build:release'
          junit './test-results/*.xml'
        }

      }
    }

  }
}