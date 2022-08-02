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
        sshPublisher(publishers: [sshPublisher(publishers: [sshPublisherDesc(configName: 'Strato - Beta - TrainSpotter', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: 'ls -I "robots*" -I "sitemap*" | xargs rm -rf', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '', useSftpForExec: true)], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])])
      }
    }

  }
}