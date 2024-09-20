pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/nifty-range-calc.git'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn clean verify sonar:sonar'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("nifty-range-calc")
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    dockerImage.run('-p 80:80')
                }
            }
        }
    }
}
