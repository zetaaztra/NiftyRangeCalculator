pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS14'
        maven 'maven3'
    }

    environment {
        SCANNER_HOME= tool 'sonar-scanner'
    }

    stages {
        stage('Install Global npm Packages') {
            steps {
                sh 'npm install -g http-server yarn pm2 eslint gulp-cli grunt-cli typescript webpack webpack-cli jest nodemon'
            }
        }
    
        stage('GIT CHECKOUT') {
            steps {
                git branch: 'main', url: 'https://github.com/zetaaztra/NiftyRangeCalculator.git'
            }
        }
    
        stage('MAVEN COMPILE') {
            steps {
                sh "mvn compile"
            }
        }
        
        stage('MAVEN TEST') {
            steps {
                sh "mvn test"
            }
        }
        
        stage('TRIVY FILESYSTEM SCAN') {
            steps {
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }

        stage('SONARQUBE ANALYSIS') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=Nifty Range Calc by Pravin A Mathew -Dsonar.projectKey=nifty-range-calc\
                            -Dsonar.java.binaries=. '''
                }
            }
        }

        stage('QUALITY GATE') {
            steps {
                script {
                  waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token' 
                }
            }
        }

        stage('MAVEN BUILD') {
            steps {
               sh "mvn package"
            }
        }
        
        stage('BUILD & TAG DOCKER IMAGE') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                            sh "docker build -t NiftyRangeCalculator ."
                    }
               }
            }
        }

        stage('IMAGE SCANNING') {
            steps {
                sh "trivy image --format table -o trivy-image-report.html NiftyRangeCalculator"
            }
        }   
            
        stage('DOCKER DEPLOYMENT') {
            steps {
                sh "docker run -d -p 8090:8080 NiftyRangeCalculator"
            }
        }   
    }
} 
