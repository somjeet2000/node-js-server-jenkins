pipeline {
    agent any

    environment {
        // Docker
        DOCKERHUB_REPO = 'somjeetsrimani/node-js-server-jenkins'
        IMAGE_TAG = 'v1'

        // EC2 Instance Details
        SSH_KEY = 'ssh-key-id-simple-node-server'
        REMOTE_HOST = '52.66.251.252'
        REMOTE_USER = 'ubuntu'
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

        // Stage 3 - Run test cases
        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh 'npm install'
                        sh 'npm test'
                        echo "👍 All Test Cases Passed!"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
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

        // Stage 5 - Deploy to EC2 Instance
        stage('Deploy to Server ${env.REMOTE_HOST}') {
            steps {
                sshagent([SSH_KEY]) {
                    sh '''echo "Connecting with the server $REMOTE_HOST"
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST <<EOF
echo "🎉 Server Connected..."
echo "🚀 Pulling latest Docker image..."
echo "Using image: $DOCKERHUB_REPO:$IMAGE_TAG"
docker pull $DOCKERHUB_REPO:$IMAGE_TAG
echo "🚧 Stopping and removing existing container (if exists)..."
docker stop node-js-server-jenkins || true
docker rm node-js-server-jenkins || true
echo "🏃‍♂️‍➡️ Running new container..."
docker run -d --name node-js-server-jenkins -p 5000:5000 $DOCKERHUB_REPO:$IMAGE_TAG
EOF'''
                }
            }
        }
    }
}