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

    stage('Unit test') {
      parallel {
        stage('Unit test') {
          steps {
            nodejs('NodeJS 18.7.0') {
              sh 'yarn run test:release'
              junit 'test-results/*.xml'
            }

          }
        }

        stage('Documentation coverage') {
          steps {
            nodejs('NodeJS 18.7.0') {
              sh 'yarn run documentation_coverage'
            }

          }
        }

      }
    }

    stage('Lint') {
      steps {
        nodejs('NodeJS 18.7.0') {
          sh 'yarn run prettier_and_lint'
        }

      }
    }

    stage('Build') {
      steps {
        nodejs('NodeJS 18.7.0') {
          sh 'yarn run build:release'
        }

      }
    }

    stage('Deploy') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'strato_sftp', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            def remote = [:]
            remote.name = "Strato"
            remote.host = "ssh.strato.com"
            remote.allowAnyHosts = true
            remote.user = USERNAME
            remote.password = PASSWORD
            sshCommand remote: remote, command: 'set nonomatch'
            sshCommand remote: remote, command: 'cd Beta/TrainSpotter'
            sshCommand remote: remote, command: 'ls -I "robots*" -I "sitemap*" | xargs rm -rf'
          }
        }

      }
    }

  }
}