pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('DOCKER_USERNAME')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
        GROQ_API_KEY    = credentials('GROQ_API_KEY')
        FRONTEND_IMAGE  = "${DOCKER_USERNAME}/whatsapp-frontend"
        BACKEND_IMAGE   = "${DOCKER_USERNAME}/whatsapp-backend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                echo "✅ Branch: ${env.GIT_BRANCH}"
                echo "✅ Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Building frontend Docker image...'
                sh """
                    docker build \
                        --build-arg VITE_BACKEND_URL=http://localhost:5000 \
                        -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${FRONTEND_IMAGE}:latest \
                        ./frontend
                """
                echo '✅ Frontend image built successfully'
            }
        }

        stage('Build Backend') {
            steps {
                echo '🔨 Building backend Docker image...'
                sh """
                    docker build \
                        -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${BACKEND_IMAGE}:latest \
                        ./backend
                """
                echo '✅ Backend image built successfully'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh """
                    docker run --rm \
                        ${BACKEND_IMAGE}:latest \
                        node -e "
                            const express = require('express');
                            const mongoose = require('mongoose');
                            console.log('✅ Express version:', require('./node_modules/express/package.json').version);
                            console.log('✅ Mongoose version:', require('./node_modules/mongoose/package.json').version);
                            console.log('✅ All dependencies verified');
                        "
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing images to Docker Hub...'
                sh """
                    echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
                    docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${FRONTEND_IMAGE}:latest
                    docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${BACKEND_IMAGE}:latest
                    docker logout
                """
                echo '✅ Images pushed successfully'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                sh """
                    docker-compose down || true
                    GROQ_API_KEY=${GROQ_API_KEY} docker-compose up -d
                """
                echo '✅ Application deployed successfully'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            echo "Frontend image: ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
            echo "Backend image:  ${BACKEND_IMAGE}:${BUILD_NUMBER}"
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
        always {
            echo '🧹 Cleaning up dangling images...'
            sh 'docker image prune -f || true'
        }
    }
}