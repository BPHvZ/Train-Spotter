pipeline {
  triggers {
    pollSCM 'H/5 * * * *'
  }
  options {
    disableConcurrentBuilds abortPrevious: true
  }
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

    stage('Deploy docs') {
      when {
        branch 'main'
      }
      steps {
        nodejs('NodeJS 18.7.0') {
          sh 'rm -rf docs'
          sh 'yarn run compodoc'
        }

        script {
          withCredentials([gitUsernamePassword(credentialsId: '0fcceade-e11a-48f2-8a3d-22765c8229f9', gitToolName: 'git-tool')]) {
            sh '''cd docs && git init && \
git add . && \
git commit -m "Deploy to GitHub Pages" && \
git remote add origin https://github.com/BPHvZ/Train-Spotter.git && \
git push -uf origin main:docs'''
          }
        }

      }
    }

    stage('Deploy beta') {
      when {
        branch 'develop'
      }
      steps {
        script {
          ftpPublisher alwaysPublishFromMaster: false, continueOnError: false, failOnError: false, paramPublish: [parameterName: ''], masterNodeName: 'master', publishers: [[configName: 'bartvanzeist.nl', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'betatreinenkaart.bartvanzeist.nl', remoteDirectorySDF: false, removePrefix: 'dist/trainSpotter', sourceFiles: 'dist/trainSpotter/']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
        }

      }
    }

    stage('Deploy main') {
      when {
        branch 'main'
      }
      steps {
        script {
          ftpPublisher alwaysPublishFromMaster: false, continueOnError: false, failOnError: false, paramPublish: [parameterName: ''], masterNodeName: 'master', publishers: [[configName: 'bartvanzeist.nl', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'treinenkaart.bartvanzeist.nl', remoteDirectorySDF: false, removePrefix: 'dist/trainSpotter', sourceFiles: 'dist/trainSpotter/']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
        }

      }
    }

  }
}
