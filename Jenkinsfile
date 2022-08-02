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

    stage('Deploy docs') {
      when { branch 'develop' }
      steps {
        nodejs('NodeJS 18.7.0') {
          sh 'rm -rf docs'
          sh 'yarn run compodoc'
        }
        script {
          withCredentials([usernamePassword(credentialsId: '0fcceade-e11a-48f2-8a3d-22765c8229f9', usernameVariable: 'EMAIL', passwordVariable: 'PAT')]) {
            sh 'cd docs && git init && git add . && git commit -m "Deploy to GitHub Pages" && git remote add origin https://$PAT@github.com/BPHvZ/Train-Spotter.git'
            sh 'git push --force origin main:docs'
          }
        }
      }
    }

    stage('Deploy beta') {
      when { branch 'develop' }
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'strato_sftp', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            def remote = [:]
            remote.name = "ssh.strato.de"
            remote.host = "ssh.strato.de"
            remote.allowAnyHosts = true
            remote.user = USERNAME
            remote.password = PASSWORD
            sshCommand remote: remote, command: 'set nonomatch && cd Beta/TrainSpotter && ls -I "robots*" -I "sitemap*" | xargs rm -rf'
            sshPut remote: remote, from: 'dist/trainSpotter', into: 'Beta/TrainSpotter'
            sshCommand remote: remote, command: 'cp -R Beta/TrainSpotter/trainSpotter/. Beta/TrainSpotter && rm -rf Beta/TrainSpotter/trainSpotter'
          }
        }

      }
    }

    stage('Deploy main') {
      when { branch 'main' }
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'strato_sftp', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            def remote = [:]
            remote.name = "ssh.strato.de"
            remote.host = "ssh.strato.de"
            remote.allowAnyHosts = true
            remote.user = USERNAME
            remote.password = PASSWORD
            sshCommand remote: remote, command: 'set nonomatch && cd TrainSpotter && ls -I "robots*" -I "sitemap*" -I "google*" | xargs rm -rf'
            sshPut remote: remote, from: 'dist/trainSpotter', into: 'TrainSpotter'
            sshCommand remote: remote, command: 'cp -R TrainSpotter/trainSpotter/. TrainSpotter && rm -rf TrainSpotter/trainSpotter'
          }
        }

      }
    }

  }
}
