pipeline {
    agent any

    environment {
        // Docker
        DOCKERHUB_REPO = 'somjeetsrimani/node-js-server-jenkins'
        IMAGE_TAG = 'v1'
    }

    stages {
        // Stage 1 - Clean Workspace
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        // Stage 2 - Code checkout
        stage('Code Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/somjeet2000/node-js-server-jenkins.git']])
            }
        }

        // Stage 3 - Build Docker Image
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_REPO:$IMAGE_TAG .'
            }
        }

        // Stage 4 - Push to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    echo 'DockerHub Login Successful 🎉'
                    sh 'docker push $DOCKERHUB_REPO:$IMAGE_TAG'
                    echo 'Image succesfully pushed to DockerHub 🎊'
                }
            }
        }
    }
}