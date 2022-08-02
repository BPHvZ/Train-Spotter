pipeline {
  agent any
  stages {
    stage('Prepare') {
      steps {
        sh 'corepack enable'
        yarn 'install'
      }
    }

  }
}